Main Reporting Part
=======
- Most of the reporting implementation is stored in reporting.js
- copy everything from line 83 on (is marked), the part before contains the constructon of dialogBox 
- In order to get the reporting text for a specific test method, call the function <b>getReportingText(method)</b>

Further necessary functions
========
Apart from reporting.js file, there are some further functions and variables in other files I developed you need for reporting implementation. The parts are also marked with "COPY THIS" so that you can easily search for them
- Function: <b>function getPurePValue(presult)</b> in <i>statistics_helper.js</i>
-	Function: <b>function getEffectSizeAmount(effectSizeType, effectSize)</b> in <i>statistics_helper.js</i>
-	Function: <b>function omitZeroPValueNotation(p)</b> in <i>statistics-helper.js</i>
- Global Variable: <b>var resultsFromANOVA</b> in <i>global variables.js</i>
- Copy code to function <i>displaySignificanceResults</i> in <i>drawing.js</i>:
  <b> var testType = testResults["test-type"]; 
      if (testType == "owA" || testType == "kwT" || testType == "WA" || testType == "owrA" || testType == "fT")           
      resultsFromANOVA = getReportingText(testType); </b> 
- Copy code to function <i>displayANOVAresults</i> in <i>drawing.js</i>
  <b> resultsFromANOVA = getReportingText(testResults["test-type"]); </b>

Formatting
========
- "/n" is used as line break
- <i> and </i> are used to depict variables and statistics as italic
