function reportingResults()
{
   //var window = window.open("");
   //if (window!=null) {  // Hat das Öffnen 
                         // des Fensters geklappt?
   //   window.document.open();  // Öffnen für 
                                // Schreibzugriff, Pflicht!
   //   window.document.write(tag("html") + tag("body"));
     // window.document.write(tag("h1") + "Reporting" +
       // tag ("/h1"));
      //window.document.write(tag("/body") +
        //tag ("/html"));
      //window.document.close();  // Schreibzugriff
                                 // beenden, Pflicht!
var canvas = d3.select("#plotCanvas");
    
    var dialogBoxHeight = plotHeight/2;
    var dialogBoxWidth = plotWidth/2;
    
    var centerX = canvasWidth/2;
    var centerY = canvasHeight/2;
    
    var variableList = sort(currentVariableSelection);
    
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
            .attr("y", centerY - dialogBoxHeight/4)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeVariablePanel + "px")
            .text("HOW TO REPORT")
            .attr("id", "reporting")
            .attr("class", "dialogBox");

}
