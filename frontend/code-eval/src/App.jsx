import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProblemPage from './components/ProblemPage'
import Home from './components/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SubmissionPage from './components/SubmissionPage'
import Context from "./components/Context.jsx"
import SettingPage from './components/SettingPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import SignupPage from './components/SignupPage.jsx'
function App() {
  const userInfo = {
    submissions: [],
    password: ""
  }

  return (
    <Context.Provider value = {userInfo}>
      <Router basename="/CodeEval">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pow1" element={<ProblemPage
                                        title = "Two Sum"
                                        description = "HI"
                                        input1 = {"2 7 11 15\n9"}
                                        input2 = {"3 2 4\n6"}
                                        input3 = {"3 3\n6"}
                                        output1 = "0 1"
                                        output2 = "1 2"
                                        output3 = "0 1"
                                        ex1 = "Because nums[0] + nums[1] == 9, we return 0 1."
                                        ex2 = "Self-explantory"
                                        ex3 = "Self-explanatory"/>} />
          <Route path="/pow2" element={<ProblemPage
                                        title = "Longest Substring Without Repeating Characters"
                                        description = "Given a string 's', find the length of the longest substring without duplicate characters."
                                        input1 = "abcabcbb"
                                        input2 = "bbbbb"
                                        input3 = "pwwkew"
                                        output1 = "3"
                                        output2 = "1"
                                        output3 = "3"
                                        ex1 = "The answer is 'abc', with the length of 3."
                                        ex2 = "The answer is 'b', with the length of 1."
                                        ex3 = "The answer is 'wke', with the length of 3. Notice that the answer must be a substring, 'pwke' is a subsequence and not a substring."/>} />
          <Route path="/pow3" element={<ProblemPage
                                        title = "Palindrome Number"
                                        description = "Given an integer x, return true if x is a palindrome, and false otherwise."
                                        input1 = "121"
                                        input2 = "-121"
                                        input3 = "10"
                                        output1 = "true"
                                        output2 = "false"
                                        output3 = "false"
                                        ex1 = "121 reads as 121 from left to right and from right to left."
                                        ex2 = "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
                                        ex3 = "Reads 01 from right to left. Therefore it is not a palindrome."/>} />
          <Route path="/pow4" element={<ProblemPage
                                        title = "Valid Parentheses"
                                        description = "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid."
                                        input1 = "()"
                                        input2 = "()[]{}"
                                        input3 = "([)]"
                                        output1 = "true"
                                        output2 = "true"
                                        output3 = "false"
                                        ex1 = "Self-explanatory"
                                        ex2 = "Self-explanatory"
                                        ex3 = "Self-explanatory"/>} />
          <Route path="/contest1" element={<ProblemPage
                                        title = "Furina's Rounding"
                                        description = "Optimistic as usual, Furina rounds all numbers up to 1 significant digit. Unfortunately for her, Neuvillette requires precise numbers for official documents. Given the precise number as an integer, Neuvillette needs to calculate an adjustment value that must be subtracted from Furina's rounded number. Since these numbers may be extremely large, mental math would be insufficient. Seeing your outstanding programming reputation, Neuvillette asks you to compute the adjustment value as previously described."
                                        input1 = "299"
                                        input2 = "8"
                                        input3 = "60000"
                                        output1 = "1"
                                        output2 = "0"
                                        output3 = "0"
                                        ex1 = "Furina rounds 299 up to 300. The required adjustment is 1."
                                        ex2 = "Furina's rounded number is the same. Therefore, no adjustment is needed."
                                        ex3 = "Furina's rounded number is the same. Therefore, no adjustment is needed."/>} />
          <Route path="/contest2" element={<ProblemPage
                                        title = "Chess!"
                                        description = "Shiro loves chess and thus asks you to code a program that outputs the value of a given chess piece. The pieces include a queen worth 9, a rook worth 5, a bishop and a knight worth 3 each, a pawn worth 1, and the king being priceless. Given the name of the piece, your program is to provide the respective value or 'priceless'."
                                        input1 = "queen"
                                        input2 = "king"
                                        input3 = "rook"
                                        output1 = "9"
                                        output2 = "priceless"
                                        output3 = "5"
                                        ex1 = "The queen is valued 9 points."
                                        ex2 = "The king has no value."
                                        ex3 = "The rook is valued 5 points."/>} /> 
          <Route path="/contest3" element={<ProblemPage
                                        title = "IB Grading"
                                        description = "It's almost the summer break, and you've been given the chance to help grade the IB physics exams! In fact, you are only responsible for matching each of the student's responses to the true/false questions with the answer key. However, an inconvenience stands in your way: this needs to be done for potentially tens of thousands of students from across the globe! As the hours pass by, you notice that many students fell just short of achieving the minimum passing score of correct answers, and you begin to wonder how many more students would have passed, if you were just able to decide the answer key for yourself. Finally, bored out of your mind from the hours of monotone work, you decide to take a short break and begin programming the answer to your hypothetical question...The first line of input will contain space-separated integers N, M, and K, the number of students, number of questions, and cutoff for a passing grade. The next N lines contains M space-separated integers, each of which are a 1 or 0. If the answer key is defined as a list of M ones and zeroes, then the ith student will get the jth problem correct if and only if the jth number on the answer key matches their answer. Print the maxmimum number of students that are able to achieve a passing grade."
                                        input1 = {"3 5 5\n10100\n10100\n10101"}
                                        input2 = {"4 3 2\n101\n100\n011\n111"}
                                        input3 = "No third example"
                                        output1 = "2"
                                        output2 = "3"
                                        output3 = "No third example"
                                        ex1 = "If the answer key was set to 10100, the first and second students would achieve a perfect score and pass with all five questions correct."
                                        ex2 = "If the answer key was set to 111, the first, third, and fourth students would achieve a passing score. Note that there is no answer key which allows all students to pass."
                                        ex3 = "No third example"/>} />      
          <Route path="/contest4" element={<ProblemPage
                                        title = "Rock, Paper, Scissors!"
                                        description = "You are playing a game of rock, paper, scissors with your friend. The game consists of N rounds and has some odd rules. Your friend will tell you what object they will play on each round and in exchange, you can only play one object for all rounds. You win the game if you win strictly more rounds than your friend. You would like to know if it is possible to win the game playing only one object. As a reminder, rock beats scissors, paper beats rock, and scissors beat paper. If two of the same objects are played against each other, its a draw and no one wins that round. Can you build a program to do this? The first line of input will contain a positive integer, representing the number of rounds you are playing. The next M lines will contain what your friend will play on the round. It will either be rock, paper, or scissors. Print yes if it is possible to win the game by playing one object for all rounds, and no otherwise."
                                        input1 = {"4\nrock\npaper\nrock\nscissors"}
                                        input2 = {"3\nrock\npaper\nscissors"}
                                        input3 = "No third example"
                                        output1 = "yes"
                                        output2 = "no"
                                        output3 = "No third example"
                                        ex1 = "If you choose paper to play for all rounds, you will win two of them and your friend will only win one. This means you can win the game and yes is printed."
                                        ex2 = "No matter what you choose, your friend will always win the same amount of rounds as you. This means you cannot win the game and no is printed."
                                        ex3 = "No third example."/>} />      
          <Route path="/contest5" element={<ProblemPage
                                        title = "Wand Selection"
                                        description = "Megumin loves creating explosions and wishes to buy a new wand. When buying a new wand, she is instructed to find the average volume of her explosions, rounded down to the nearest cubic meter, so they can pick the best one. As her consultant, she asks you to do it for her. Unfortunately, she did not record the explosions herself, so she instead provides you with property damage reports that contain the volume of that explosion in cubic meters. However, one of the explosions was created together with the Crimson Magic clan. Since the Crimson Magic clan is so strong, the explosion created with them is always the largest one. She asks that you don't include this explosion in the average.The first line of input is N, the number of explosions. The next N lines contain one positive integer, i, the size of each explosion. Output one integer, the average volume of her explosions, excluding the largest one and rounded down to the nearest integer."
                                        input1 = {"5\n3\n4\n1\n7\n2"}
                                        input2 = {"2\n10\n10"}
                                        input3 = "No third example."
                                        output1 = "2"
                                        output2 = "10"
                                        output3 = "No third example."
                                        ex1 = "Excluding the largest explosion, 7, the average is 2.5. Rounded down this is 2."
                                        ex2 = "Self explanatory."
                                        ex3 = "No third example."/>} />
          <Route path="/submissions" element={<SubmissionPage/>} />
          <Route path="/settings" element={<SettingPage/>} /> 
          <Route path="/signup" element={<SignupPage/>} />                                                                                                                                                                                        
        </Routes>
      </Router>
    </Context.Provider>
  )
}

export default App
