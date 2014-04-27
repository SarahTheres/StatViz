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
            .attr("height", dialogBoxHeight/3)
            .attr("rx", "5px")
            .attr("ry", "5px")
            .attr("fill", "white")
            .attr("stroke", "grey")
            .attr("filter", "url(#shadow)")
            .attr("id", "regression")
            .attr("class", "dialogBox");
    
    var LEFT = (width - canvasWidth - sideBarWidth) + centerX - dialogBoxWidth/2;
    var TOP = centerY - dialogBoxHeight/2;
    
    var divElement = d3.select("body").append("div").attr("style", "position: absolute; left: " + LEFT + "px; top: " + TOP + "px; height: " + dialogBoxHeight + "px; width: " + dialogBoxWidth + "px; text-align: center;").attr("class", "dialogBox");

    var normality = d3.select("#normality.crosses");
    var inText = d3.select("#normality.crosses").attr("display") == "inline" ? "POPULATION MEDIAN = " : "POPULATION MEAN = ";
    
    divElement.append("label")
                .attr("align", "center")
                .attr("vertical-align", "middle")
                .attr("style", "font:1.2em \"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif; color: black; padding-top: 10px;")
                .text(inText);
    divElement.append("input")
                .attr("type", "text")
                .attr("style", "border-color: #000000")
                .attr("id", "populationValue");
                
    divElement.append("br");
    divElement.append("br");
    
    divElement.append("input")
                .attr("type", "button")
                .attr("onclick", "populationMeanEntered()")
                .attr("id", "oneSampleTestButton")
                .attr("style", "fill: url(#buttonFillNormal); filter: url(#Bevel)")
                .attr("value","TEST AGAINST POPULATION ESTIMATE");
    

}
