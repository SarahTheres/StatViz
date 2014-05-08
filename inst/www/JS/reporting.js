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
   console.log("Bin in reportingText Method");
   
   //significance tests
   if (method == "upT" || method == "pt" || method == "wT" || method == "mwT" || method == "owA" || method == "WA" 
   || method == "kwT" || method == "twA" || method == "owrA" || method == "fT" || method == "fA")
   {
      reportingText = getSignificanceTestReportingText(method);
      console.log("Hab mir Reporting Text geholt" + reportingText);
   }
   //post-hoc tests
   else if (method == "ptT" || method == "pwt")
   {
      //display reporting text from ANOVA before and add post-hoc reporting text
      reportingText = resultsFromANOVA;
      console.log("Ich gehe in die post-hoc Anweisung:" + reportingText);
      //reset ANOVA results text
      resultsFromANOVA = "";
   }
   
   return reportingText;
}

//returns reporting text for significance tests
function getSignificanceTestReportingText(method)
{
    //all text is stored in this variable
   var text = "";
   //variables for mean, standard deviation and n
   var m;
   var sd;
   var n;
   //get current variables
   var variableList = getSelectedVariables();
   
   //first sentence including method, in case that method is unpaired there has to be an "an" instead of an "a"
   text += (method == "upT" ? "An " : "A ") + testResults["method"] + " has been conducted to investigate the effect of ";
   
   //add each condition of IV its mean, standard deviation and n have to be reported
   for (var i=0; i<variableList["independent-levels"].length; i++)
   {
      //add indepdent variable
      text += variableList["independent-levels"][i] + " (";
      
      //add mean and round it to 3 decimals places
      m = mean(variables[variableList["dependent"]][variableList["independent-levels"][i]]);
      text += "M = " + m.toFixed(3) + ", ";
      
      //add standard deviation and round it to 3 decimals places
      sd = getStandardDeviation(variables[variableList["dependent"]][variableList["independent-levels"][i]]);
      text += "SD = " + sd.toFixed(3) + ", ";
      
      //TODO: add n
      text += "n = " + (variables[variableList["dependent"]][variableList["independent-levels"][i]]).length + ")";
      
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
   
   //if parameter type is cS, the letters have to be changed to display correctly
   var parameterType = testResults["parameter-type"];
   if (parameterType == "cS")
   {
      parameterType = "𝝌" +String.fromCharCode(178);
   }
   
   //depending on type of effect size the amount (small, medium, large) is measured and is returned here
   //0 = small; 1 = small-medium; 2 = medium-large; 3: large effect; 99 = error
   var effectSizeAmount = getEffectSizeAmount(testResults["effect-size-type"], testResults["effect-size"]);
   //if effect size type is eS or RS, the letters have to be change to display correctly
   var effectSizeType = testResults["effect-size-type"];
   if (effectSizeType == "eS")
      effectSizeType = "η" + String.fromCharCode(178);
   else if (effectSizeType == "RS")
      effectSizeType = "r" + String.fromCharCode(178);
   
   //check whether p is significant
   if (p <= 0.05)
   {
      //complement text and give parameter result and exact p-value (rounded to 3 decimal places)
      text += " A significant difference could be reported " + parameterType + "(" + testResults["df"] + ") = " + testResults["parameter"] + ", " + testResults["p"] + ".";
   
      //add effect size text depending on amount of effect
      if (effectSizeAmount == 0)
      {
         text += " However, only a small-sized effect could be measured";
      }
      else if (effectSizeAmount == 1)
      {
         text += " However, only a small to medium-sized effect could be measured";
      }
      else if (effectSizeAmount == 2)
      {
         text += " Additionally, a medium to large-sized effect could be detected";
      }
      else if (effectSizeAmount == 3)
      {
         text += " Additionally, a large-sized effect could be detected";
      }
      else
      {
         //TODO: error handling => no effect size
      }
      
      //add effect-size value
      text += " (" + effectSizeType + "= " + testResults["effect-size"] + ").";
   }
   else
   {
      text += " The descriptive difference is not significant (p = " + p + ").";
      
       //add effect size text depending on amount of effect
      if (effectSizeAmount == 2)
      {
         text += " However, it did represent a medium to large-sized effect (" + effectSizetype + "= " + testResults["effect-size"] + ").";
      }
      else if (effectSizeAmount == 3)
      {
         text += " However, it did represent a large-sized effect (" + effectSizeType + "= " + testResults["effect-size"] + ").";
      }
      
      //in case that effect size is smaller than medium, it is not remarkable as no signifikant results
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
   
   text += "A " + testResults["method"] + " revealed that there is " + (p < 0.05 ? "a" : "no") + "significant difference between " 
   
   //add conditions of indepdent variable (there can only be two due to pairwise)
   text += variableList["independent-levels"][0] + " and " + variableList["independent-levels"][1];
   
   //TODO: add t/value etc.
 
   //TODO: effect size
   return text;
}
