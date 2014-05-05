function reportingResults()
{
   console.log("TEST REPORTING!");
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
   callReportingMethod(testResults["method"]);
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
   reportingText = d3.select("body").append("div").attr("style", "position: absolute; left: " + reportingBoxLeft + "px; top: " + reportingBoxTop + "px; height: " + reportingBoxHeight + "px; width: " + reportingBoxWidth + "px; text-align: left;").attr("class", "reporting");

}

function callReportingMethod(method)
{
   var text = "";
   
   if (method == "Unpaired T-test")
   {
      text = getReportingText(ut);
   }
   else if (method == "Paired T-test")
   {
      text = getReportingText(pt);
   }
   else if (method == "1-way ANOVA")
   {
      text = getReportingText(1a);
   }
   else if (method == "2-way ANOVA")
   {
      text = getReportingText(2a);
   }
   else if (method == "Repeated-measures ANOVA")
   {
      text = getReportingText(rma);
   }
   
    reportingText.append("label")
                .attr("align", "left")
                .attr("vertical-align", "middle")
                .attr("style", "font:1.2em \"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif; color: black; padding-top: 10px;")
                .text(text);
}


//function writes appropriate reporting style for t-Tests in reportingBox
function reportingTTest()
{

   //all text in reportingBox is stored in this variable;
   var text;
   isPaired = true;
   // write different text depending on paired or unpaired t-test
   if (isPaired)
      text = "A paired t-test has been conducted to compare the " + testResults["dependent-variable"] + " within participants treated with "; 
   else
      //method and DV is reported
       text = "An Unpaired t-test has been conducted to compare the " + testResults["dependent-variable"] + " between ";
   
   //TODO: make more elegant
   //getting means for each independent variable and round them to 2 decimal places
   var variableList = getSelectedVariables();

   var mean0 = mean(variables[variableList["dependent"]][variableList["independent-levels"][0]]);
   mean0 = mean0.toFixed(2);

   var mean1 = mean(variables[variableList["dependent"]][variableList["independent-levels"][1]]);
   mean1 = mean1.toFixed(2);
   
    //TODO: make more elegant
   //getting means for each independent variable and round them to 2 decimal places
   var variableList = getSelectedVariables();

   var se0 = getStandardError(variables[variableList["dependent"]][variableList["independent-levels"][0]]);
   se0 = se0.toFixed(2);

   var se1 = getStandardError(variables[variableList["dependent"]][variableList["independent-levels"][1]]);
   se1 = se1.toFixed(2);
   
   //IV in both groups with their means and standard errors are added to text
   text += testResults["independent-variable-level0"] + " (M = " + mean0 + ", SE = " + se0 + ") and ";
   
   //for second variable the text differs => therefore if-condition
   if (isPaired)
      text += "with " + testResults["independent-variable-level1"] + " (M = " + mean1 + ", SE = " + se1 + ").";
   else
      text += testResults["independent-variable-level1"] + " (M = " + mean1 + ", SE = " + se1 + ") groups.";
   
   //get pure p value without letter p or any operators
   var p = getPurePValue(testResults["p"]);
   var pResult = changePValueNotationReporting(p);
   
   var effectSize = testResults["effect-size"];
   
   //check whether p is significant
   if (p <= 0.05)
   {
      //complement text and give degrees of freedom and t-value
      text += " A significant difference can be reported t(" + testResults["df"] + ")=" + testResults["parameter"] + "," + pResult + ".";
   
      //add effect size text depending on amount of effect
      if (effectSize < 0.2)
      {
         text += " However, nearly no effect could be measured";
      }
      else if (effectSize >= 0.2 && effectSize < 0.5)
      {
         text += " However, there is only a small-sized effect";
      }
      else if (effectSize >= 0.5 && effectSize < 0.8)
      {
         text += " Additionally, a medium-sized effect could be detected";
      }
      else if (effectSize >= 0.8)
      {
         text += " Additionally, a large-sized effect could be detected";
      }
      else
      {
         //TODO: error handling => no effect size
      }
      
      //add effect-size value
      text += " (d = " + effectSize + ")."
   }
   else
   {
      text += " The descriptive difference is not significant (" + pResult + ").";
      
       //add effect size text depending on amount of effect
      if (effectSize >= 0.5 && effectSize < 0.8)
      {
         text += " However, it did represent a medium-sized effect (d = " + effectSize + ").";
      }
      else if (effectSize >= 0.8)
      {
         text += " However, it did represent a large-sized effect (d = " + effectSize + ").";
      }
      
      //in case that effect size is smaller than medium, it is not remarkable as no signifikant results
   }
   
   //append label to div element reportingText and insert the reporting text
   reportingText.append("label")
                .attr("align", "left")
                .attr("vertical-align", "middle")
                .attr("style", "font:1.2em \"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif; color: black; padding-top: 10px;")
                .text(text);
    //reportingText.append("br");
}

function getReportingText(method)
{
  
   //all text is stored in this variable
   var text = "";
   var mean;
   var sd;
   var n;
   //get current variables
   var variableList = getSelectedVariables();
   
   //first sentence including method
   text += "A" + testresults["method"] + "has been conducted to investigate the effect of ";
   
   //add each condition of IV its mean, standard deviation and n have to be reported
   for (var i=0; i<variableList["independent-levels"].length; i++)
   {
      //add indepdent variable
      text += variableList["independent-levels"][i] + "(";
      
      //add mean and round it to 2 decimals places
      mean = mean(variables[variableList["dependent"]][variableList["independent-levels"][i]]);
      text += "M = " + mean.toFixed(2) + ",";
      
      //add standard deviation and round it to 2 decimals places
      sd = getStandardDeviation(variables[variableList["dependent"]][variableList["independent-levels"][i]]);
      text += "SD = " + sd.toFixed(2) + ",";   
      
      //TODO: add n
      text += "n = " + ")";
      
      //add komma between each variable, add "and" for one before last, add nothing for last one
      if (i < variableList["independent-levels"].length - 2)
         text += ", ";
      else if (i == variableList["independent-levels"].length - 2)
         text += "and";
   }
  
    //add dependent variable
   text += " on " + variableList["dependent"];
   console.log(text);
   return text;

}
