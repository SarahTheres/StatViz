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
    
    //by declaring elements as class dialogBox they are removed when calling resetSVGCanvas() 
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
    
   canvas.append("text")
            .attr("x", centerX)
            .attr("y", topY)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeVariablePanel + "px")
            .text("HOW TO REPORT")
            .attr("id", "reporting")
            .attr("class", "reporting");
            
   canvas.append("text")
            .attr("x", leftX)
            .attr("y", topY + 2*stepY)
            .attr("fill", "black")
            .attr("text-anchor", "left")
            //TODO: declare font size independently
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .text("Reporting all your results and preconditions is very important so that any other researcher can repeat your study.")
            .attr("id", "reporting")
            .attr("class", "reporting");
   
   
   //calls appropriate reporting method depending on used test method
   getReportingMethod(testResults["method"]);
}

function getReportingMethod(method)
{
   
   if (method == "Unpaired T-test")
   {
      reportingUnpairedTTest();
   }
   else if (method == "Paired T-test")
   {
      //TODO
   }
   else if (method == "1-way ANOVA")
   {
      //TODO
   }
   else if (method == "2-way ANOVA")
   {
      //TODO
   } 
   else if (method == "Repeated-measures ANOVA")
   {
      //TODO
   }
}
   
function reportingUnpairedTTest()
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
   
    var mytop = canvasWidth/2 - dialogBoxHeight/2 + stepY;
    var myleft = getWidth() - canvasWidth - sideBarWidth + (canvasWidth - dialogBoxWidth)/2 + 3; 
  
   //adding a textfield
   var textfield = document.createElement("reporting");
   textfield.style.display = "block";
   textfield.style.width = dialogBoxWidth;
   textfield.style.height = dialogBoxHeight;
   textfield.style.color = "red";
   textfield.style.position = "absolute";
   textfield.style.top = mytop + "px";
   textfield.style.left = myleft + "px";
   textfield.className = "reporting";
  
  //method and DV is reported
   var text = "An Unpaired t-test has been conducted to compare the " + testResults["dependent-variable"] + " between "; 
   
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
   
   //TODO: add se
   //IV in both groups with their means and standard errors are added to text
   text += testResults["independent-variable-level0"] + " (M = " + mean0 + " , " + se0 + ") and ";
   text += testResults["independent-variable-level1"] + " (M = " + mean1 + " , " + se1 + ") groups.\n";
   
   //get pure p value without letter p or any operators 
   var p = getPurePValue(testResults["p"]);
   var pResult = changePValueNotationReporting(p);
   
   //check whether p is significant
   if (p <= 0.05)
   {
      //complement text and give degrees of freedom and t-value
      text += "A significant difference can be reported t(" + testResults["df"] + ")=" + testResults["parameter"] + "," + pResult + ".";
   }
   else
   {
      text += "The descriptive difference is not significant (" + pResult + ").";
   }
   
   textfield.innerHTML = text;
   document.body.appendChild(textfield);

}
