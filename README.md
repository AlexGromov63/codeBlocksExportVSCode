# Code Blocks Export
## Description
This extension allows you to select multiple blocks of code to export them in markdown file. 
 
## Example of exported file:

### **File:** filename.cpp
#### **Lines:** 10 - 12
```
int main() {
    return 0;
}
```

### **File:** filename2.py
#### **Lines:** 52 - 67
```
<your code here...>
```

## How to use
MacOS: **Cmd** + **Shift** + **P**  
Windows/Linux: **Ctrl** + **Shift** + **P**  
Or you can use **F1**  
Then print `"Code Blocks Export"` and choose command

## How it works
Extension contains two functions:
* **Code Blocks Export: Add Selection**  
    Allowes you to save selected code to array of extension.
* **Code Blocks Export: Export to .md**  
    Exports all saved blocks to Markdown.  
    Options:
    1. Save to workspace root  
        Saves markdown file to root directory of your workspace in VSCode.  
        Then asks you to print name of file.
    2. Save to...  
        Opens window to choose where to save your file.
* **Code Blocks Export: Clear memory**  
    Clear all saved blocks of code.
* **Code Blocks Export: Delete last saved block**
    Deletes last added block of code.
    
