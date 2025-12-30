"""
Finny - Smart Finance Tracker
A CLI tool to track expenses and predict spending patterns
"""
import csv
CATEGORIES = ["Food", "Transport", "Fun", "Bills", "Shopping", "Health", "Other"] 
expenses = []   
"""Default categories"""
def show_categories():
    print("\nAvailable Categories:")
    for i, category in enumerate(CATEGORIES, start=1):
        print(f"{i}. {category}")

def show_menu():
    """Display available commands"""
    print("Available Commands:")
    print("categories      - View all categories")
    print("add category    - Add a new category")
    print("remove category - Remove a category")
    print("add expense     - Add a new expense")
    print("view expenses   - View all expenses") 
    print("exit            - Exit Finny")

def add_categories(): 
    """ Allows user to add custom categories"""
    show_categories()
    new_category = input("Enter new category name: ").strip().title()
    if new_category in CATEGORIES:
        print(f"Category '{new_category}' already exists.")
    elif new_category=="":
        print("Category name cannot be empty.")
    else:
        CATEGORIES.append(new_category)
        print(f"Category '{new_category}' added successfully.")

def add_expense():
    """For user to add expense"""
    print("\nAdd New Expense")
    date = input("Enter date DD-MM-YYYY: ").strip()
    name = input("Enter expense name: ").strip()
    show_categories()
    while True:
        try:
            category_choice = int(input("Select category number: ").strip())
            if category_choice < 1 or category_choice > len(CATEGORIES):
                print("Invalid choice. Please select a valid category number.")
                continue
            category = CATEGORIES[category_choice - 1]
            break
        except ValueError:
            print("Invalid input. Please enter a number.")
    while True:
        try:
            amount = float(input("Enter amount: ").strip())
            if amount < 0:
                print("Amount cannot be negative. Please enter a valid amount.")
                continue
            break
        except ValueError:  
            print("Please enter a valid numeric amount")
    expense = {
        "date" : date,
        "name" : name,
        "category" : category,
        "amount" : amount
    }
    expenses.append(expense)
    print(f"Expense '{name}' (₹{amount}) added!")

def show_expenses():
    '''Displays all expenses in a tabular format'''
    if not expenses:
        print("No expenses recorded yet. Use 'add expense' to add new expenses.")
        return
    print("\nYour Expenses:")
    print(f"{'Date':<12} {'Name':<12} {'Category':<12} {'Amount':>10}")
    total = 0
    for expense in expenses:
        print(f"{expense['date']:<12} {expense['name']:<12} {expense['category']:<12} ₹{expense['amount']:>10.2f}")
        total += expense['amount']
    print("-" * 62)
    print(f"\nTotal Expenses: ₹{total:>.2f}")
    
    return

def load_expenses():
    '''Displays all expenses in a tabular format'''
    if not expenses:
        print("No expenses recorded yet. Use 'add expense' to add new expenses.")
        return
    print("\nYour Expenses:")
    print(f"{'Date':<12} {'Name':<12} {'Category':<12} {'Amount':>10}")
    total = 0
    for expense in expenses:
        print(f"{expense['date']:<12} {expense['name']:<12} {expense['category']:<12} ₹{expense['amount']:>10.2f}")
        total += expense['amount']
    print("-" * 62)
    print(f"\nTotal Expenses: ₹{total:>.2f}")
    
    return

def save_expenses():
    """Auto save expenses to a CSV file after user exits"""
    try:
        with open("expenses.csv", "w", newline="") as file:
            writer=csv.writer(file)
            writer.writerow(["Date", "Name", "Category", "Amount"])#header row
            for expense in expenses:
                writer.writerow([
                    expense["date"],
                    expense["name"],
                    expense["category"],
                    expense["amount"]
                ])
        print(f"Saved {len(expenses)} expenses to file")
    except Exception as e:
        print(f"Error saving expenses: {e}")


def remove_categories(): 
    """ Allows user to remove existing category"""
    show_categories()
    try:
        choice=int(input("Enter the number of the category to remove: ").strip())
        if choice<1 or choice>len(CATEGORIES):
            print("Invalid choice. Please select a valid category number.")
            return
        removed_category=CATEGORIES.pop(choice-1)
        print(f"Category '{removed_category}' removed successfully.")
    except ValueError:
        print("Invalid input. Please enter a number.")

# def remove_categories(): # Allows user to remove custom/default categories
    # show_categories()
    # category_to_remove = input("Enter the name of the category to remove: ").strip().title()
    # if category_to_remove in CATEGORIES:
        # CATEGORIES.remove(category_to_remove)
        # print(f"Category '{category_to_remove}' removed successfully.")
    # else:
        # print(f"Category '{category_to_remove}' not found.")

def main():
    print("\nFinny says Hi!")
    print("\nFinny is here to help you track your expenses and predict your spending patterns so you can manage your finances better.")
    
    while True:
        command = input("\nWhat would you like to do? (Enter help for a list of commands.) ").strip().lower()
        if command == "exit":   
            save_expenses()
            print("Goodbye!")
            break
        elif command == "help":
            show_menu()
        elif command == "categories":
            show_categories()
        elif command == "add category":
            add_categories()
        elif command == "add expense" or command == "add expenses":
            add_expense()
        elif command == "view expenses" or command == "view expense" or command == "show expenses":
            show_expenses()
        elif command == "remove category":
            remove_categories()
        else:
            print(f"Executing command: {command}")
            
if __name__ == "__main__":
    main()
