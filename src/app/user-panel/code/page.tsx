"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { 
  Code, 
  Play, 
  Clock, 
  MemoryStick, 
  CheckCircle, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Lightbulb
} from "lucide-react";
import { toasterSuccess, toasterError } from "@/components/core/Toaster";
import { Editor } from '@monaco-editor/react';

// Sample coding questions
const sampleQuestions = [
  {
    id: 1,
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
    difficulty: "easy",
    hints: [
      "Use a hash map to store numbers you've seen",
      "For each number, check if its complement exists"
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Your solution here
    
}

// Test
console.log(twoSum([2,7,11,15], 9)); // Expected: [0,1]`,
      python: `def two_sum(nums, target):
    # Your solution here
    pass

# Test
print(two_sum([2,7,11,15], 9))  # Expected: [0,1]`,
      java: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
        return new int[0];
    }
}`,
      cpp: `#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your solution here
    return {};
}`
    }
  },
  {
    id: 2,
    title: "Palindrome Number",
    description: `Given an integer x, return true if x is a palindrome, and false otherwise.

Example:
Input: x = 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.`,
    difficulty: "easy",
    hints: [
      "Convert to string and check if it equals its reverse",
      "Or reverse the number mathematically"
    ],
    starterCode: {
      javascript: `function isPalindrome(x) {
    // Your solution here
    
}

// Test
console.log(isPalindrome(121)); // Expected: true
console.log(isPalindrome(-121)); // Expected: false`,
      python: `def is_palindrome(x):
    # Your solution here
    pass

# Test
print(is_palindrome(121))   # Expected: True
print(is_palindrome(-121))  # Expected: False`,
      java: `public class Solution {
    public boolean isPalindrome(int x) {
        // Your solution here
        return false;
    }
}`,
      cpp: `bool isPalindrome(int x) {
    // Your solution here
    return false;
}`
    }
  },
  {
    id: 3,
    title: "Reverse String",
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.

Example:
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]`,
    difficulty: "easy",
    hints: [
      "Use two pointers approach",
      "Swap characters from start and end moving inward"
    ],
    starterCode: {
      javascript: `function reverseString(s) {
    // Your solution here - modify s in-place
    
}

// Test
let test = ["h","e","l","l","o"];
reverseString(test);
console.log(test); // Expected: ["o","l","l","e","h"]`,
      python: `def reverse_string(s):
    # Your solution here - modify s in-place
    pass

# Test
test = ["h","e","l","l","o"]
reverse_string(test)
print(test)  # Expected: ["o","l","l","e","h"]`,
      java: `public class Solution {
    public void reverseString(char[] s) {
        // Your solution here - modify s in-place
        
    }
}`,
      cpp: `void reverseString(vector<char>& s) {
    // Your solution here - modify s in-place
    
}`
    }
  },
  {
    id: 4,
    title: "Valid Parentheses",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

Example:
Input: s = "()[]{}"
Output: true`,
    difficulty: "medium",
    hints: [
      "Use a stack data structure",
      "Push opening brackets, pop and match closing brackets"
    ],
    starterCode: {
      javascript: `function isValid(s) {
    // Your solution here
    
}

// Test
console.log(isValid("()")); // Expected: true
console.log(isValid("()[]{}")); // Expected: true
console.log(isValid("(]")); // Expected: false`,
      python: `def is_valid(s):
    # Your solution here
    pass

# Test
print(is_valid("()"))       # Expected: True
print(is_valid("()[]{}")    # Expected: True
print(is_valid("(]"))       # Expected: False`,
      java: `import java.util.*;

public class Solution {
    public boolean isValid(String s) {
        // Your solution here
        return false;
    }
}`,
      cpp: `#include <stack>
#include <string>
using namespace std;

bool isValid(string s) {
    // Your solution here
    return false;
}`
    }
  },
  {
    id: 5,
    title: "Maximum Subarray",
    description: `Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

Example:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6.`,
    difficulty: "medium",
    hints: [
      "Use Kadane's algorithm",
      "Keep track of current sum and maximum sum seen so far"
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {
    // Your solution here
    
}

// Test
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Expected: 6`,
      python: `def max_sub_array(nums):
    # Your solution here
    pass

# Test
print(max_sub_array([-2,1,-3,4,-1,2,1,-5,4]))  # Expected: 6`,
      java: `public class Solution {
    public int maxSubArray(int[] nums) {
        // Your solution here
        return 0;
    }
}`,
      cpp: `#include <vector>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Your solution here
    return 0;
}`
    }
  }
];

export default function SimpleCodingQuestions({ className }: any) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [showHints, setShowHints] = useState(false);

  const currentQuestion = sampleQuestions[currentQuestionIndex];

  // Initialize code when question or language changes
  useState(() => {
    if (currentQuestion && currentQuestion.starterCode[language]) {
      setCode(currentQuestion.starterCode[language]);
    }
  }, [currentQuestion, language]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (currentQuestion && currentQuestion.starterCode[newLanguage]) {
      setCode(currentQuestion.starterCode[newLanguage]);
    }
    setOutput('');
  };

  const handleQuestionChange = (index: number) => {
    setCurrentQuestionIndex(index);
    const question = sampleQuestions[index];
    if (question && question.starterCode[language]) {
      setCode(question.starterCode[language]);
    }
    setOutput('');
    setShowHints(false);
  };

  const resetCode = () => {
    if (currentQuestion && currentQuestion.starterCode[language]) {
      setCode(currentQuestion.starterCode[language]);
    }
    setOutput('');
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    
    try {
      // Simulate code execution (replace with actual execution service)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock output - in real implementation, you'd send code to execution service
      setOutput('Code executed successfully!\n\nNote: This is a demo. Connect to a real code execution service like Judge0 for actual execution.');
      toasterSuccess('Code executed successfully!');
    } catch (error) {
      setOutput('Error: Failed to execute code');
      toasterError('Failed to execute code');
    } finally {
      setIsRunning(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const supportedLanguages = ['javascript', 'python', 'java', 'cpp'];

  return (
    <div className={cn("rounded-[10px] bg-white shadow-1 dark:bg-gray-dark", className)}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
              <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Coding Practice
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {sampleQuestions.length}
              </p>
            </div>
          </div>
          
          {/* Question Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuestionChange(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <select
              value={currentQuestionIndex}
              onChange={(e) => handleQuestionChange(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {sampleQuestions.map((q, index) => (
                <option key={q.id} value={index}>
                  {index + 1}. {q.title}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleQuestionChange(Math.min(sampleQuestions.length - 1, currentQuestionIndex + 1))}
              disabled={currentQuestionIndex === sampleQuestions.length - 1}
              className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Problem Description */}
        <div className="border-r border-gray-200 dark:border-gray-700">
          <div className="p-6">
            {/* Question Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentQuestion.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                  {currentQuestion.difficulty.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none mb-6 dark:prose-invert">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
                {currentQuestion.description}
              </pre>
            </div>

            {/* Hints */}
            {currentQuestion.hints && currentQuestion.hints.length > 0 && (
              <div className="mb-6">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium text-sm"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showHints ? 'Hide Hints' : 'Show Hints'} ({currentQuestion.hints.length})
                </button>
                {showHints && (
                  <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {currentQuestion.hints.map((hint, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Output */}
            {output && (
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <h4 className="font-bold mb-2 text-gray-900 dark:text-white">Output:</h4>
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {output}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex flex-col">
          {/* Editor Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Code Editor</h4>
              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {supportedLanguages.map(lang => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={resetCode}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-[400px]">
            <Editor
              height="400px"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                lineNumbers: 'on',
              }}
            />
          </div>

          {/* Run Button */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <button
              onClick={runCode}
              disabled={isRunning || !code.trim()}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Code
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Connect to Judge0 or similar service for actual code execution
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}