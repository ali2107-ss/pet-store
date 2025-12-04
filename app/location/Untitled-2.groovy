#include <iostream>
#include <iomanip>
#include <memory>
using namespace std;

// Глобальная переменная (статическая память)
int globalCounter = 0;

// Функция для работы со стеком
void stackExample() {
    cout << "\n--- STACK EXAMPLE ---\n";

    int a = 5;
    int b = 10;

    cout << "a = " << a << " | address: " << &a << endl;
    cout << "b = " << b << " | address: " << &b << endl;
}

// Функция для динамической памяти (heap)
int* createDynamicNumber(int value) {
    int* ptr = new int(value);
    return ptr;
}

// Работа с динамическим массивом
void dynamicArrayExample() {
    cout << "\n--- DYNAMIC ARRAY EXAMPLE ---\n";

    int size;
    cout << "Enter array size: ";
    cin >> size;

    int* arr = new int[size];

    for(int i = 0; i < size; i++) {
        arr[i] = (i + 1) * 10;
    }

    cout << "Array values:\n";
    for(int i = 0; i < size; i++) {
        cout << "arr[" << i << "] = " << arr[i]
             << " | address: " << &arr[i] << endl;
    }

    delete[] arr;
}

// Использование умного указателя
void smartPointerExample() {
    cout << "\n--- SMART POINTER EXAMPLE ---\n";

    unique_ptr<int> smartPtr = make_unique<int>(99);
    cout << "Smart pointer value: " << *smartPtr << endl;
}

// Структура для демонстрации
struct Student {
    string name;
    int age;
    float grade;
};

void structExample() {
    cout << "\n--- STRUCT EXAMPLE ---\n";

    Student* s = new Student;
    s->name = "Alex";
    s->age = 20;
    s->grade = 4.5;

    cout << "Name: " << s->name << endl;
    cout << "Age: " << s->age << endl;
    cout << "Grade: " << s->grade << endl;

    delete s;
}

int main() {
    cout << "===== MEMORY DISTRIBUTION DEMO =====\n";

    // Стековые переменные
    int stackVar = 10;
    float stackFloat = 3.14f;

    // Динамическая память
    int* heapVar = new int(50);

    cout << "\n--- BASIC VARIABLES ---\n";
    cout << "Global counter: " << globalCounter 
         << " | address: " << &globalCounter << endl;

    cout << "Stack int: " << stackVar 
         << " | address: " << &stackVar << endl;

    cout << "Stack float: " << stackFloat 
         << " | address: " << &stackFloat << endl;

    cout << "Heap int: " << *heapVar 
         << " | address: " << heapVar << endl;

    // Увеличиваем глобальную переменную
    globalCounter += 5;
    cout << "Updated globalCounter: " << globalCounter << endl;

    // Вызовы функций
    stackExample();

    int* dynamicNum = createDynamicNumber(123);
    cout << "\nDynamic number: " << *dynamicNum 
         << " | address: " << dynamicNum << endl;

    dynamicArrayExample();
    smartPointerExample();
    structExample();

    // Освобождение памяти
    delete heapVar;
    delete dynamicNum;

    cout << "\n===== PROGRAM FINISHED SUCCESSFULLY =====\n";
    return 0;
}