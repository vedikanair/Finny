import { useState, useRef, useCallback } from "react";
import { parseTranscript } from "@/lib/ai";

const CONFIDENCE_THRESHOLD = 0.7;

export function useVoice(categories = []) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [parsedResult, setParsedResult] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | recording | parsing | confirm | error | low_confidence
  const recognitionRef = useRef(null);

  const startRecording = useCallback(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setStatus("error");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setStatus("recording");
      setTranscript("");
      setParsedResult(null);
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";
      let confidence = 1;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          confidence = result[0].confidence;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);

      if (finalTranscript && confidence < CONFIDENCE_THRESHOLD) {
        setStatus("low_confidence");
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setStatus("error");
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopRecording = useCallback(async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);

    if (!transcript || status === "error") return;

    setStatus("parsing");

    try {
      const result = await parseTranscript(transcript, categories);
      if (!result) {
        setStatus("error");
        return;
      }
      if (result.confidence === "low") {
        setStatus("low_confidence");
      } else {
        setStatus("confirm");
      }
      setParsedResult(result);
    } catch {
      setStatus("error");
    }
  }, [transcript, status, categories]);

  const reset = useCallback(() => {
    setTranscript("");
    setParsedResult(null);
    setStatus("idle");
  }, []);

  return {
    isRecording,
    transcript,
    parsedResult,
    status,
    startRecording,
    stopRecording,
    reset,
  };
}
