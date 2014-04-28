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
            .attr("class", "dialogBox");
    
   canvas.append("text")
            .attr("x", centerX)
            .attr("y", topY)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeVariablePanel + "px")
            .text("HOW TO REPORT")
            .attr("id", "reporting")
            .attr("class", "dialogBox");
            
   canvas.append("text")
            .attr("x", leftX)
            .attr("y", topY + 2*stepY)
            .attr("fill", "black")
            .attr("text-anchor", "left")
            //TODO: declare font size independently
            .attr("font-size", fontSizeSignificanceTestResults)
            .text("Reporting all your results and preconditions is very important so that any other researcher can repeat your study.")
            .attr("id", "reporting")
            .attr("class", "dialogBox");
   
   //shows current Method         
   canvas.append("text")
            .attr("x", leftX)
            .attr("y", topY + 3*stepY)
            .attr("fill", "black")
            .attr("text-anchor", "left")
              //TODO: declare font size independently
            .attr("font-size", fontSizeSignificanceTestResults)
            .text("The method used is " + testResults["method"])
            .attr("id", "reporting")
            .attr("class", "dialogBox");
            
   //shows p value           
   canvas.append("text")
            .attr("x", leftX)
            .attr("y", topY + 4*stepY)
            .attr("fill", "black")
            .attr("text-anchor", "left")
              //TODO: declare font size independently
            .attr("font-size", fontSizeSignificanceTestResults)
            .text(testResults["p"])
            .attr("id", "reporting")
            .attr("class", "dialogBox");
   
   //TODO: if-Abfrage einbauen, ob signifikant oder nicht
    var p = removeAlphabetsFromString(testResults["p"]);
    p = removeOperatorsFromString(p);
    
     canvas.append("text")
            .attr("x", leftX)
            .attr("y", topY + 5*stepY)
            .attr("fill", "black")
            .attr("text-anchor", "left")
              //TODO: declare font size independently
            .attr("font-size", fontSizeSignificanceTestResults)
            .text(p)
            .attr("id", "reporting")
            .attr("class", "dialogBox");

   if (p > 0.05)
   {
      canvas.append("text")
            .attr("x", leftX)
            .attr("y", topY + 6*stepY)
            .attr("fill", "black")
            .attr("text-anchor", "left")
              //TODO: declare font size independently
            .attr("font-size", fontSizeSignificanceTestResults)
            .text("There are no statistically significant differences")
            .attr("id", "reporting")
            .attr("class", "dialogBox");
   }
   else
   {
       canvas.append("text")
            .attr("x", leftX)
            .attr("y", topY + 6*stepY)
            .attr("fill", "black")
            .attr("text-anchor", "left")
              //TODO: declare font size independently
            .attr("font-size", fontSizeSignificanceTestResults)
            .text("There are statistically significant differences")
            .attr("id", "reporting")
            .attr("class", "dialogBox");
   }
   
    //shows effect size           
   canvas.append("text")
            .attr("x", leftX)
            .attr("y", topY + 7*stepY)
            .attr("fill", "black")
            .attr("text-anchor", "left")
              //TODO: declare font size independently
            .attr("font-size", fontSizeSignificanceTestResults)
            .text("The effect size is " + testResults["effect-size"])
            .attr("id", "reporting")
            .attr("class", "dialogBox");

}
