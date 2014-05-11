function reportingResults()
{
   
    var canvas = d3.select("#plotCanvas");
    
    var dialogBoxHeight = plotHeight;
    var dialogBoxWidth = plotWidth;
    
    var centerX = canvasWidth/2;
    var centerY = canvasHeight/2;
    
    //present results in the following line which starts one step further
    var stepY = dialogBoxHeight/15;
    //top and left of dialog box
    var topY = (centerY - dialogBoxHeight/2) + stepY;
    var leftX = centerX - dialogBoxWidth/2;
    
    //create rect for reporting dialog box
    canvas.append("rect")
            .attr("x", centerX - dialogBoxWidth/2)
            .attr("y", centerY - dialogBoxHeight/2)
            .attr("width", dialogBoxWidth)
            .attr("height", dialogBoxHeight)
            .attr("rx", "5px")
            .attr("ry", "5px")
            .attr("fill", "white")
            .attr("stroke", "grey")
            .attr("filter", "url(#shadow)")
            .attr("id", "reporting")
            .attr("class", "reporting");

   //declare new div as headline
   var reportingHeadline = d3.select("body").append("div").attr("style", "position: absolute; left: " + centerX + "px; top: " + topY + "px; height: " + dialogBoxHeight + "px; width: " + dialogBoxWidth + "px; text-align: center;").attr("class", "reporting");
   //add text to headline div
   reportingHeadline.append("label")
                     .attr("align", "center")
                     .attr("vertical-align", "top")
                     .attr("style", "font:1.6em \"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif; color: black; padding-top: 10px;")
                     .text("HOW TO REPORT RESULTS");
   
   //declare new div as headline
   var reportingIntroduction = d3.select("body").append("div").attr("style", "position: absolute; left: " + centerX + "px; top: " + (topY + 2*stepY) + "px; height: " + dialogBoxHeight + "px; width: " + dialogBoxWidth + "px; text-align: left;").attr("class", "reporting");
   //add text to introduction div
   reportingIntroduction.append("label")
                     .attr("align", "left")
                     //.attr("vertical-align", "top")
                     .attr("style", "font:0.8em \"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif; color: black; padding-top: 10px;")
                     .text("Reporting all your results and preconditions is very important so that any other researcher can repeat your study.");
                     
   //draws the reporting textbox as the position is the same for every test
   setReportingTextbox();
   //calls appropriate reporting method depending on used test method
   var text = getReportingText(testResults["test-type"]);
   reportingTextField.append("label")
                .attr("align", "left")
                .attr("vertical-align", "middle")
                .attr("style", "font:1.2em \"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif; color: black; padding-top: 10px;")
                .text(text);
}

function setReportingTextbox()
{
   //TODO: deletable???
   //var canvas = d3.select("#plotCanvas");
   
   // reporting textbox height is a third of dialogbox height
   var dialogBoxHeight = plotHeight;
   var reportingBoxHeight = dialogBoxHeight / 3;
   
   //reporting textbox width is same as dialogbox width but leaves a small border
   var dialogBoxWidth = plotWidth;
   var reportingBoxWidth = dialogBoxWidth - dialogBoxWidth/20;
   
   //reporting box position => left (x) = center; top (y) = 40%
   var reportingBoxLeft = canvasWidth/2;
   var reportingBoxTop = (2*canvasHeight)/5;
   
   //create a new div element for reporting the text
   reportingTextField = d3.select("body").append("div").attr("style", "position: absolute; left: " + reportingBoxLeft + "px; top: " + reportingBoxTop + "px; height: " + reportingBoxHeight + "px; width: " + reportingBoxWidth + "px; text-align: left;").attr("class", "reporting");

}

/* test methods:
   upT = unpaired t-test
   pT = paired t-test
   wT = Wilcoxon test
   mwT = Mann-Whitney test
   owA = one-way ANOVA
   WA = Welch's ANOVA
   kwT = Kruskall Wallis test
   twA = two-way ANOVA
   owrA = one-way repeated measure ANOVA
   fT = Friedmann Test
   fA = Mixed Design ANOVA
   ptT = pairwise t-test
   pwT = pairwise Wilcox test
*/   

//returns the reporting text for each method, attribute method (in general testResults[test-type])
function getReportingText(method)
{
   var reportingText = "";
   
   //significance tests with one IV
   if (method == "upT" || method == "pT" || method == "wT" || method == "mwT" || method == "owA" || method == "WA" 
   || method == "kwT" || method == "owrA" || method == "fT" )
      reportingText = getSignificanceTestReportingText(method);
   
   //significance tests with two IVs
   else if (method == "twA" || method == "fA")
   {
      reportingText = getSignificanceTest2WayReportingText;
   }
   
   //post-hoc tests
   else if (method == "ptT" || method == "pwT")
   {
      //display reporting text from ANOVA before and add post-hoc reporting text
      reportingText = resultsFromANOVA + "\n";
      reportingText += getPostHocReportingText(method);
      //reset ANOVA results text
      resultsFromANOVA = "";
   }
   console.log(reportingText);
   return reportingText;
}

//returns reporting text for significance tests
function getSignificanceTestReportingText(method)
{
    //all text is stored in this variable
   var text = "";
 
  //get current variables
   var variableList = getSelectedVariables();
   var currentIVlevel;
   
   //first sentence including method, in case that method is unpaired there has to be an "an" instead of an "a"
   text += (method == "upT" ? "An " : "A ") + testResults["method"] + " has been conducted to investigate the effect of ";
   
   //add each condition of IV its mean, standard deviation and n have to be reported
   for (var i=0; i<variableList["independent-levels"].length; i++)
   {
      
      currentIVlevel = variableList["independent-levels"][i]; 
      text += getVariableCharacteristicsReportingText(variableList["dependent"], currentIVlevel, variableList);
      
      //add komma between each variable, add "and" for one before last, add nothing for last one
      if (i < variableList["independent-levels"].length - 2)
         text += ", ";
      else if (i == variableList["independent-levels"].length - 2)
         text += " and ";
   }
  
    //add dependent variable
   text += " on " + variableList["dependent"] + ".";

   //get pure p value without letter p or any operators
   var p = getPurePValue(testResults["p"]);
   
   //check whether p is significant
   if (p <= 0.05)
    
      text += " A significant difference could be reported ";
   else
      text += " The descriptive difference is not significant ";
   
   //add results of test to text
   text += getTestResultsReportingText(testResults["parameter-type"], testResults["df"], testResults["parameter"], testResults["p"]);
   //add effect size to text
   text += getEffectSizeReportingText(p, testResults["effect-size"]);
   
   return text;

}

function getSignificanceTest2WayReportingText(method)
{
   var text = "";
   
   //get current variables
   //var variableList = getSelectedVariables();
   var variableList = sort(currentVariableSelection);
   
   //add both IVs
   text += "In order to compare the effect of " + variableList["independent"][0] + " and " + variableList["independent"][1] + " as well as their interaction ";
   //add DV and method
   text += " on " + variableList["dependent"] + ", a " + testResults["method"] + " has been conducted.\n";
   var currentIVlevel;
   
   //add main effects of each independent variable and for the interaction (therefore, i <= nr. of IV)
   for (var i=0; i<=variableList["independent"].length; i++)
   {
       //differ text between significant and non-significant p
      var p = getPurePValue(testResults["p"][i]);
      
      //results of each independent variable
      if (i<variableList["independent"].length)
      {
            //varying text so that text is more fluent: start
         if (i%2 == 0)
            text += "There is " + (p < 0.05 ? "a" : "no") + " signifcant difference between ";
         else
            text += "Comparing  "
         
         //add independent variables' levels and their means, n, sds, ci 
         for (var j = 0; j<variableList["independent-levels"][i].length; j++)
         {
            //get current level of current IV
            currentIVlevel = variableList["independent-levels"][i][j]; 
            text += getVariableCharacteristicsReportingText(variableList["dependent"], currentIVlevel, variableList);
   
            //add komma between each variable, add "and" for one before last, add nothing for last one
            if (j < variableList["independent-levels"][i].length - 2)
               text += ", ";
            else if (j == variableList["independent-levels"][i].length - 2)
               text += " and ";
         }
         
         
          //varying text so that text is more fluent: end
         if (i%2 == 0)
            //add dependent variable
            text += " on " + variableList["dependent"] + " ";
         else
            //add dependent variable and whether signifcant
            text += ", a " + (p < 0.05 ? "" : "non-") + "significant main effect on " + variableList["dependent"] + " has been determined " 
            
      }
      //results for interaction
      else
      {
         text += "Investigating the interaction between " + variableList["independent"][0] + " and " + variableList["independent"][1] + ", "; 
         text += (p < 0.05 ? "a " : "no ") + "sigifnicant difference could have been identified ";
      }
      
      //add results of test to text
      text += getTestResultsReportingText(testResults["parameter-type"], testResults["df"][i], testResults["parameter"][i], testResults["p"]);
      
      //add effect size to text
      text += getEffectSizeReportingText(p, testResults["effect-size"][i]);
      
      //add line break if this is not the last part of reporting textt
      if (i<variableList["independent"].length)
         text += "\n";
      
   }
   return text;
}

//returns reporting text for post-hoc tests => has its own function in order to differ the text for better readability
function getPostHocReportingText(method)
{
   //add prior text from test before
   var text = "";
   
   //get pure p value without letter p or any operators
   var p = getPurePValue(testResults["p"]);
   var variableList = getSelectedVariables();
   
   text += "A " + testResults["method"] + " revealed that there is " + (p < 0.05 ? "a" : "no") + " significant difference between "; 
   
   //add conditions of indepdent variable (there can only be two due to pairwise)
   text += variableList["independent-levels"][0] + " and " + variableList["independent-levels"][1] + ", ";
   
   //add results of test to text
   text += getTestResultsReportingText(testResults["parameter-type"], testResults["df"][i], testResults["parameter"][i], testResults["p"]);
         
   //add effect size to text
   text += getEffectSizeReportingText(p, testResults["effect-size"]);
  
   return text;
}

//function returns reporting text for given independent variable's level and its characteristics (m/mdn, sd, n, ci)
function getVariableCharacteristicsReportingText(dependentVariable, IVlevel, variableList)
{
   //variables for mean, median, confidence interval, standard deviation and number of participants
   var m, mdn, ci, sd, n;
   var text = "";
   //data distribution of a variable in order to calculate characteristics
   var distribution = variables[variableList["dependent"]][IVlevel];
   
   //add IV i: level j 
   text +=  IVlevel + " (";
   
   //report median for ordinal data and mean for rest of variable types
   if (variableTypes[dependentVariable] == "ordinal")
   {
      mdn = median(distribution);
      text += "Mdn = " + mdn.toFixed(3) + ", ";
   }
   else
   {
      m = mean(distribution);
      text += "M = " + m.toFixed(3) + ", ";
   }
   
   //add confidence intervals (round values to 3 decimal places)
   ci = findCI(distribution);
   text += "95% CI [" + ci[0].toFixed(3) + "," + ci[1].toFixed(3) + "], ";
      
   //add standard deviation and round it to 3 decimals places
   sd = getStandardDeviation(distribution);
   text += "SD = " + sd.toFixed(3) + ", ";
            
   //add n
   text += "n = " + (distribution).length + ")";
            
   return text;
}   

//returns reporting text for results of test
function getTestResultsReportingText(parameterType, df, parameter, p)
{
   var text = "";
   //if parameter type is cS, the letters have to be changed to display correctly
   if (parameterType == "cS")
      parameterType = String.fromCharCode(967) + String.fromCharCode(178);

   //complement text and give parameter result and degrees of freedom (if parameter has some) 
   text += parameterType + (hasDF[parameterType] ? "(" + df + ") " : "") + " = " + parameter + ", ";

   //change p-value notation so that first zero is omitted
   p = omitZeroPValueNotation(p);
   //add exact p-value (unless smaller than 0.001)
   text += p + ".";
   
   return text;
}

//depending on p-value and effect size, the effect size text is returned
function getEffectSizeReportingText(p, effectSize)
{
   var text = "";
   
   //depending on type of effect size the amount (small, medium, large) is measured and is returned here
   //0 = small; 1 = small-medium; 2 = medium-large; 3: large effect; 99 = error
   var effectSizeAmount = getEffectSizeAmount(testResults["effect-size-type"], effectSize);
   //if effect size type is eS or RS, the letters have to be change to display correctly
   var effectSizeType = testResults["effect-size-type"];
   if (effectSizeType == "eS")
      effectSizeType = "η" + String.fromCharCode(178);
   else if (effectSizeType == "RS")
      effectSizeType = "r" + String.fromCharCode(178);
      
   if (p < 0.05)
   {
      //add effect size text depending on amount of effect
      if (effectSizeAmount == 0)
         text += " However, it did represent nearly no effect";
      else if (effectSizeAmount == 1)
         text += " However, it did only represent a small-sized effect";
      else if (effectSizeAmount == 2)
         text += " The differences constitute a medium effect size";
      else if (effectSizeAmount == 3)
         text += " The differences constitute a large effect size";
      //else: TODO error handling => no effect size
      
      //add effect-size value
      text += " (" + effectSizeType + " = " + effectSize + "). ";
   }
   //p > 0.05 (not significant)
   else 
   {
           //add effect size text depending on amount of effect
      if (effectSizeAmount == 2)
         text += " However, it did represent a medium-sized effect (" + effectSizetype + "= " + effectSize + ").";
      else if (effectSizeAmount == 3)
         text += " However, it did represent a large-sized effect (" + effectSizeType + "= " + effectSize + ").";
      //in case that effect size is smaller than medium, it is not remarkable as no signifikant results
   }
   
   return text;
}
