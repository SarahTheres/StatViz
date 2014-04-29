//drawing
function getWidth()
{
      var x = 0;
      if (self.innerHeight)
      {
              x = self.innerWidth;
      }
      else if (document.documentElement && document.documentElement.clientHeight)
      {
              x = document.documentElement.clientWidth;
      }
      else if (document.body)
      {
              x = document.body.clientWidth;
      }
      return x;
}

function getHeight()
{
      // var y = 0;
      // if (self.innerHeight)
      // {
      //         y = self.innerHeight;
      // }
      // else if (document.documentElement && document.documentElement.clientHeight)
      // {
      //         y = document.documentElement.clientHeight;
      // }
      // else if (document.body)
      // {
      //         y = document.body.clientHeight;
      // }
      // return y;

      var w = getWidth();
      return w/1.745;
}

function plotVisualisation()
{   
    resetSVGCanvas();
    drawFullScreenButton();
   
    switch(currentVisualisationSelection)
    {
        case "Histogram":
                                    {
                                        curveX = [];
                                        curveY = [];
                                        
                                        makeHistogram();
                                        
                                        break;
                                    }
        case "Boxplot":
                                    { 
                                        boxes = [];
                                        meanCircles = [];
                                        medianLines = [];
                                        topFringes = [];
                                        bottomFringes = [];
                                        topFringeConnectors = [];
                                        bottomFringeConnectors = [];
                                        CILines = [];
                                        CITopLines = [];
                                        CIBottomLines = [];
                                        yAxisTexts = [];
                                        outlierValues = [];
                                        topFringeValues = [];
                                        bottomFringeValues = [];
                                        testResults = new Object();
                                        distributions = new Object();
                                        variances = new Object();
                                        
                                        makeBoxplot();
                                        
                                        break;
                                    }
        case "Scatterplot":
                                    {
                                        makeScatterplot();
                                        
                                        break;
                                    }
        case "Scatterplot-matrix":
                                    {
                                        makeScatterplotMatrix();
                                        
                                        break;
                                    }
    }
}

function resetSVGCanvas()
{
    removeElementsByClassName("regressionPredictionDiv");
    removeElementsByClassName("dialogBox");
    //When Canvas is reset, reporting button and reporting dialog box should be removed
    removeElementsByClassName("reporting");
    removeElementsByClassName("reportingButton");
    
    if(document.getElementById("plotCanvas") != null)
        removeElementById("plotCanvas");
    if(document.getElementById("sideBarCanvas") != null)
        removeElementById("sideBarCanvas");
            
    var plotCanvas = d3.select("#canvas").append("svg");        
    plotCanvas.attr("id", "plotCanvas")
              .attr("x", 0)
              .attr("y", 0)
              .attr("height", canvasHeight)
              .attr("width", canvasWidth)
              .attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
            
    var sideBarCanvas = d3.select("#sideBar").append("svg");        
    sideBarCanvas.attr("id", "sideBarCanvas")
              .attr("x", 0)
              .attr("y", 0)
              .attr("height", canvasHeight)
              .attr("width", sideBarWidth)
              .attr("viewBox", "0 0 " + sideBarWidth + " " + canvasHeight);
    
    drawHelpButton();
    drawResetButton();
}

function drawFullScreenButton()
{    
    //TODO 
}

function drawHelpButton()
{
    var sideBar = d3.select("#sideBarCanvas");

    var helpButtonOffset = assumptionImageSize*2;
    var size = variableNameHolderHeight;

    sideBar.append("rect")
            .attr("x", 6*sideBarWidth/8 - size/2)
            .attr("y", variableNameHolderPadding)
            .attr("rx", visualizationHolderRadius)
            .attr("ry", visualizationHolderRadius)
            .attr("height", size)
            .attr("width", size)
            .attr("fill", "url(#buttonFillNormal)")
            .attr("filter", "url(#Bevel)")
            .attr("stroke", "black")
            .attr("class", "helpButtonBack");
    
    sideBar.append("text")
            .attr("x", 6*sideBarWidth/8)
            .attr("y", variableNameHolderPadding + size/2 + 2*yAxisTickTextOffset)
            .attr("font-size", scaleForWindowSize(35))
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text("A")
            .attr("class", "helpButtonText");
    
    sideBar.append("rect")
            .attr("x", 6*sideBarWidth/8 - size/2)
            .attr("y", variableNameHolderPadding)
            .attr("rx", visualizationHolderRadius)
            .attr("ry", visualizationHolderRadius)
            .attr("height", size)
            .attr("width", size)
            .attr("opacity", "0.1")
            .attr("class", "helpButtonFront");
}

function drawResetButton()
{
    var sideBar = d3.select("#sideBarCanvas");        

    var helpButtonOffset = assumptionImageSize*2;
    var size = variableNameHolderHeight;
    
    sideBar.append("rect")
            .attr("x", sideBarWidth/4 - size/2)
            .attr("y", variableNameHolderPadding)
            .attr("rx", visualizationHolderRadius)
            .attr("ry", visualizationHolderRadius)
            .attr("height", size)
            .attr("width", size)
            .attr("fill", "url(#buttonFillNormal)")
            .attr("filter", "url(#Bevel)")
            .attr("stroke", "black")
            .attr("display", "none")
            .attr("class", "resetButtonBack");
    
    sideBar.append("image")
            .attr("x", sideBarWidth/4 - size/4)
            .attr("y", variableNameHolderPadding + size/4)
            .attr("height", size/2)
            .attr("width", size/2)
            .attr("display", "none")
            .attr("xlink:href", "images/reset.png")
            .attr("class", "resetButtonImage");
    
    sideBar.append("rect")
            .attr("x", sideBarWidth/4 - size/2)
            .attr("y", variableNameHolderPadding)
            .attr("rx", visualizationHolderRadius)
            .attr("ry", visualizationHolderRadius)
            .attr("height", size)
            .attr("width", size)
            .attr("opacity", "0.001")
            .attr("class", "resetButtonFront");
}

function drawButtonInSideBar(buttonText, className, offset)
{
    if(offset == undefined)
        offset = 0;
        
    var canvas = d3.select("#sideBarCanvas");
    
    canvas.append("rect")
            .attr("x", assumptionImageSize)
            .attr("y", canvasHeight - buttonOffset + offset*(buttonPadding/2 + buttonHeight))
            .attr("width", sideBarWidth - assumptionImageSize*2)
            .attr("height", buttonHeight)
            .attr("rx", scaleForWindowSize(10) + "px")
            .attr("ry", scaleForWindowSize(10) + "px")
            .attr("fill", "url(#buttonFillNormal)")
            .attr("filter", "url(#Bevel)")
            .attr("stroke", "black")
            .attr("id", "button")
            .attr("class", className);
    
    canvas.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight - buttonOffset + offset*(buttonPadding/2 + buttonHeight) + buttonHeight/2 + yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .text(buttonText)
            .attr("font-size", fontSizeButtonLabel + "px")
            .attr("id", "text")
            .attr("class", className); 
}

function drawDialogBoxToGetOutcomeVariable()
{
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
            .attr("id", "regression")
            .attr("class", "dialogBox");
    
    canvas.append("text")
            .attr("x", centerX)
            .attr("y", centerY - dialogBoxHeight/4)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeVariablePanel + "px")
            .text("SELECT THE OUTCOME VARIABLE")
            .attr("id", "regression")
            .attr("class", "dialogBox");
            
    var step = (dialogBoxHeight/2)/currentVariableSelection.length;
    var yStart = centerY;
    var buttHeight = step - 10;
    
    for(var i=0; i<currentVariableSelection.length; i++)
    {
        if(variableRows[currentVariableSelection[i]] == "dependent")
        {
            canvas.append("rect")
                    .attr("x", centerX - dialogBoxWidth/3)
                    .attr("y", i*step + yStart)
                    .attr("width", 2*dialogBoxWidth/3)
                    .attr("height", buttHeight)
                    .attr("rx", scaleForWindowSize(10) + "px")
                    .attr("ry", scaleForWindowSize(10) + "px")
                    .attr("fill", "url(#buttonFillNormal)")
                    .attr("filter", "url(#Bevel)")
                    .attr("stroke", "black")
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "outcomeVariable");
            canvas.append("text")
                    .attr("x", centerX)
                    .attr("y", i*step + yStart + buttHeight/2 + yAxisTickTextOffset)
                    .attr("text-anchor", "middle")
                    .text(currentVariableSelection[i])
                    .attr("font-size", fontSizeVariablePanel)
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "outcomeVariable");
        }
    }
}

function drawDialogBoxToGetPopulationMean()
{
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

function drawEffectSize(value)
{
    var sideBar = d3.select("#sideBarCanvas");    
    var type = testResults["effect-size-type"];

    value = parseFloat(value);
    
    if(type == "d")
        value = value > 5.0 ? 5.0 : value;
    
    var min = parseFloat(effectSizeMins[type]);
    var max = parseFloat(effectSizeMaxs[type]);
    
    var color = getColour(type, value);
    
    var L = sideBarWidth/2 - effectSizeWidth/2;
    var T = significanceTestResultOffsetTop - significanceTestResultStep - effectSizeHeight/2;
    
    var bar = sideBar.append("rect")
                        .attr("x", L)
                        .attr("y", T)
                        .attr("width", effectSizeWidth)
                        .attr("height", effectSizeHeight)
                        .attr("stroke", "MediumSlateBlue")
                        .attr("fill", "none")
                        .attr("class", "effectSize");
            
    var scale = d3.scale.linear()
                            .domain([min, max])
                            .range([0, effectSizeWidth]);
    
    if(scale(min + value) > 0)
    {
        var effectSize = sideBar.append("rect")
                                    .attr("x", L + scale(0))
                                    .attr("y", T)
                                    .attr("width", scale(min + (value - 0)))
                                    .attr("height", effectSizeHeight)
                                    .attr("fill", color)
                                    .attr("class", "effectSize");
    }
    else
    {
        var effectSize = sideBar.append("rect")
                                    .attr("x", L + scale(0) + scale(min + (value - 0)))
                                    .attr("y", T)
                                    .attr("width", -scale(min + (value - 0)))
                                    .attr("height", effectSizeHeight)
                                    .attr("fill", color)
                                    .attr("class", "effectSize");
    }

    if(Math.abs(scale(min + value)) > effectSizeWidth/4)
    {   
        if(value < 0)
        {
            sideBar.append("text")
                .attr("x", L + scale(0) + scale(min + (value - 0)) + yAxisTickTextOffset)
                .attr("y", significanceTestResultOffsetTop - significanceTestResultStep + effectSizeHeight/2 - yAxisTickTextOffset)
                .attr("text-anchor", "start")
                .attr("font-size", effectSizeFontSize)
                .attr("fill", "white")
                .text(value)
                .attr("id", "effectSizeValue")
                .attr("class", "effectSize");    
        }
        else
        {
            sideBar.append("text")
                .attr("x", L + scale(0) + scale(min + (value - 0)) - yAxisTickTextOffset)
                .attr("y", significanceTestResultOffsetTop - significanceTestResultStep + effectSizeHeight/2 - yAxisTickTextOffset)
                .attr("text-anchor", "end")
                .attr("font-size", effectSizeFontSize)
                .attr("fill", "white")
                .text(value)
                .attr("id", "effectSizeValue")
                .attr("class", "effectSize");
        }
    }
    else
    {
        if(value < 0)
        {
            sideBar.append("text")
                .attr("x", L + scale(0) + scale(min + (value - 0)) - yAxisTickTextOffset)
                .attr("y", significanceTestResultOffsetTop - significanceTestResultStep + effectSizeHeight/2 - yAxisTickTextOffset)
                .attr("text-anchor", "end")
                .attr("font-size", effectSizeFontSize)
                .attr("fill", "black")
                .text(value)
                .attr("id", "effectSizeValue")
                .attr("class", "effectSize");    
        }
        else
        {
            sideBar.append("text")
                .attr("x", L + scale(0) + scale(min + (value - 0)) + yAxisTickTextOffset)
                .attr("y", significanceTestResultOffsetTop - significanceTestResultStep + effectSizeHeight/2 - yAxisTickTextOffset)
                .attr("text-anchor", "start")
                .attr("font-size", effectSizeFontSize)
                .attr("fill", "black")
                .text(value)
                .attr("id", "effectSizeValue")
                .attr("class", "effectSize");    
        }
        
    }
    
    sideBar.append("text")
            .attr("x", L + scale(min))
            .attr("y", T + 3*effectSizeHeight/2)
            .attr("text-anchor", "start")
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "darkgrey")
            .attr("id", "labelMin")
            .attr("class", "effectSize")
            .text(min);
    
    sideBar.append("text")
            .attr("x", L + scale(max))
            .attr("y", T + 3*effectSizeHeight/2)
            .attr("text-anchor", "end")
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "darkgrey")
            .attr("id", "labelMax")
            .attr("class", "effectSize")
            .text(max);
    
    var effectSizeInterpretationIndicators = ["small", "medium", "large"];
        
    for(i=0; i<effectSizeInterpretations[type].length; i++)
    {
        sideBar.append("line")
                .attr("x1", L + scale(effectSizeInterpretations[type][i]))
                .attr("y1", T)
                .attr("x2", L + scale(effectSizeInterpretations[type][i]))
                .attr("y2", T + effectSizeHeight)
                .attr("stroke", "black")
                .attr("display", "none")
                .attr("class", "effectSizeInterpretationIndicators");
        sideBar.append("text")
                .attr("x", L + scale(effectSizeInterpretations[type][i]))
                .attr("y", T - yAxisTickTextOffset)
                .attr("transform", "rotate (-45 " + (L + scale(effectSizeInterpretations[type][i])) + " " + (T - yAxisTickTextOffset) + ")")
                .attr("text-anchor", "start")
                .attr("font-size", scaleForWindowSize(14) + "px")
                .text(effectSizeInterpretationIndicators[i])
                .attr("fill", getColour(type, effectSizeInterpretations[type][i]))
                .attr("display", "none")
                .attr("class", "effectSizeInterpretationIndicators");
    }
    
    
    if(min < 0)
    {
        for(i=0; i<effectSizeInterpretations[type].length; i++)
        {
            sideBar.append("line")
                    .attr("x1", L + scale(-effectSizeInterpretations[type][i]))
                    .attr("y1", T)
                    .attr("x2", L + scale(-effectSizeInterpretations[type][i]))
                    .attr("y2", T + effectSizeHeight)
                    .attr("stroke", "black")
                    .attr("display", "none")
                    .attr("class", "effectSizeInterpretationIndicators");
            sideBar.append("text")
                    .attr("x", L + scale(-effectSizeInterpretations[type][i]))
                    .attr("y", T - yAxisTickTextOffset)
                    .attr("transform", "rotate (-45 " + (L + scale(-effectSizeInterpretations[type][i])) + " " + (T - yAxisTickTextOffset) + ")")
                    .attr("text-anchor", "start")
                    .attr("font-size", scaleForWindowSize(14) + "px")
                    .text(effectSizeInterpretationIndicators[i])
                    .attr("fill", getColour(type, effectSizeInterpretations[type][i]))
                    .attr("display", "none")
                    .attr("class", "effectSizeInterpretationIndicators");
        }
    
        sideBar.append("text")
            .attr("x", L + scale(0))
            .attr("y", T + 3*effectSizeHeight/2)
            .attr("text-anchor", "middle")
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "darkgrey")
            .attr("id", "labelMid")
            .attr("class", "effectSize")
            .text(0);
    }
    
    if(type == "eS")
    {    
        var mainText = sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop - significanceTestResultStep - effectSizeHeight/2 - yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "black")
            .attr("id", "effectSizeText")
            .attr("class", "effectSize");
            
        mainText.append("tspan")
                    .text("η");
        mainText.append("tspan")
                    .attr("baseline-shift", "super")
                    .text("2");
    }
    else if(type == "rS")
    {    
        var mainText = sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop - significanceTestResultStep - effectSizeHeight/2 - yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", effectSizeFontSize)
            .attr("id", "effectSizeText")
            .attr("fill", "black")
            .attr("class", "effectSize");
            
        mainText.append("tspan")
                    .text("r");
        mainText.append("tspan")
                    .attr("baseline-shift", "super")
                    .text("2");
    }
    else
    {
        sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop - significanceTestResultStep - effectSizeHeight/2 - yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", effectSizeFontSize)
            .attr("id", "effectSizeText")
            .attr("fill", "black")
            .text(type)
            .attr("class", "effectSize");
    } 
    
    sideBar.append("rect")
            .attr("x", L)
            .attr("y", T)
            .attr("width", effectSizeWidth)
            .attr("height", effectSizeHeight)
            .attr("stroke", "black")
            .attr("opacity", "0.001")
            .attr("id", "effectSizeFront");        
}

function drawParameter(DF, parameter)
{
    var sideBar = d3.select("#sideBarCanvas");
    
    var type = testResults["parameter-type"];
    

    
    var X = sideBarWidth/2;
    var Y = significanceTestResultOffsetTop + 2*significanceTestResultStep;
    
    if(type == "cS")
    {
        var mainText = sideBar.append("text")
                .attr("x", X)
                .attr("y", Y)
                .attr("font-size", fontSizeSignificanceTestResults + "px")
                .attr("text-anchor", "middle")
                .attr("fill", "#627bf4")
                .attr("class", "parameter");
            
        mainText.append("tspan")
                    .text("𝝌");
        
        mainText.append("tspan")
                    .attr("baseline-shift", "super")
                    .text("2");
        
        mainText.append("tspan")
                    .text("(" + DF + ") = " + parameter);
    }
    else
    {
        if(hasDF[type] && !pairwiseComparisons)
        {
            sideBar.append("text")
                    .attr("x", X)
                    .attr("y", Y)
                    .attr("font-size", fontSizeSignificanceTestResults + "px")
                    .attr("text-anchor", "middle")
                    .attr("fill", "#627bf4")
                    .attr("class", "parameter")
                    .text(type + "(" + DF + ") = " + parameter);
        }
        else
        {
            sideBar.append("text")
                .attr("x", X)
                .attr("y", Y)
                .attr("text-anchor", "middle")
                .attr("font-size", fontSizeSignificanceTestResults + "px")
                .attr("fill", "#627bf4")
                .attr("class", "parameter")
                .text(type + " = " + parameter);
        }
    }
}    

function drawComputingResultsImage()
{
    var sideBar = d3.select("#sideBarCanvas");
    
    var T = sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 - computingResultsImageSize/2)
            .text("PICKING THE APPROPRIATE TEST...")
            .attr("font-size", scaleForWindowSize(14))
            .attr("text-anchor", "middle")
            .attr("id", "computingResultsImage");
    
    T.transition().duration(750).attr("opacity", "0.2");
    T.transition().delay(750).duration(750).attr("opacity", "1.0");
    
    setInterval(function()
    {
        T.transition().duration(750).attr("opacity", "0.2");
        T.transition().delay(750).duration(750).attr("opacity", "1.0");
    }, 1500);
}

function setOpacityForElementsWithClassNames(classNames, opacity)
{
    for(var i=0; i<classNames.length; i++)
    {
        d3.selectAll("." + classNames[i]).transition().duration(1000).delay(500).attr("opacity", opacity);
    }
}

//Significance Tests
function loadAssumptionCheckList(type)
{
    var canvas = d3.select("#sideBarCanvas");
    
    var title = canvas.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", assumptionOffsetTop)
            .attr("font-size", fontSizeAssumptionsTitle + "px")
            .attr("text-anchor", "middle")
            .attr("opacity", "0")
            .attr("fill", "#627bf4")
            .text("ASSUMPTIONS")
            .attr("class", "checkingAssumptions");
    
    title.transition().delay(500).duration(700).attr("opacity", "1.0").attr("y", assumptionOffsetTop - 50);
    
    //timer for 500 ms
    setTimeout(function(){
        for(var i=0; i<assumptions[type].length; i++)
        {
            canvas.append("rect")
                    .attr("x", assumptionImageSize*1.25) 
                    .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 10)
                    .attr("width", sideBarWidth - 1.5*assumptionImageSize)
                    .attr("height", assumptionImageSize)
                    .attr("rx", "5px")
                    .attr("ry", "5px")
                    .attr("fill", "url(#buttonFillNormal)")
                    .attr("filter", "url(#Bevel)")
                    .attr("stroke", "black")
                    .attr("id", assumptions[type][i])
                    .attr("class", "assumptionsButtonBack");
                    
            canvas.append("text")
                    .attr("x", assumptionImageSize*1.25 + assumptionImageSize/2)
                    .attr("y", i*assumptionStep + assumptionOffsetTop - 5)
                    .attr("font-size", fontSizeAssumptions + "px")
                    .attr("fill", "black")
                    .text(assumptionsText[assumptions[type][i]])
                    .attr("id", assumptions[type][i])
                    .attr("class", "assumptions");
                
            canvas.append("image")
                    .attr("x", 0)
                    .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 10)
                    .attr("text-anchor", "end")
                    .attr("xlink:href", "images/checkingAssumptions.gif")
                    .attr("height", assumptionImageSize)            
                    .attr("width", assumptionImageSize)
                    .attr("id", assumptions[type][i])
                    .attr("class", "loading");
                
            canvas.append("image")
                    .attr("x", 0)
                    .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 10)
                    .attr("text-anchor", "end")
                    .attr("xlink:href", "images/tick.png")
                    .attr("height", assumptionImageSize)            
                    .attr("width", assumptionImageSize)
                    .attr("display", "none")
                    .attr("id", assumptions[type][i])
                    .attr("class", "ticks");
                         
            canvas.append("image")
                    .attr("x", 0)
                    .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 8)
                    .attr("text-anchor", "end")
                    .attr("xlink:href", "images/cross.png")
                    .attr("height", assumptionImageSize)
                    .attr("width", assumptionImageSize)
                    .attr("display", "none")
                    .attr("id", assumptions[type][i])
                    .attr("class", "crosses");
                
            canvas.append("rect")
                    .attr("x", assumptionImageSize*1.25) 
                    .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 10)
                    .attr("width", sideBarWidth - 1.5*assumptionImageSize)
                    .attr("height", assumptionImageSize)
                    .attr("rx", "5px")
                    .attr("ry", "5px")
                    .attr("opacity", "0.1")
                    .attr("id", assumptions[type][i])
                    .attr("class", "assumptionsButtonFront");
        }    
    }, 1200);
    
    
}

function drawNormalityPlot(dependentVariable, level, type)
{
    //make histogram with these variables in a separate svg
    removeElementsByClassName("homogeneityPlot")
    
    var mean;
    if(level == "dataset")
        mean = d3.select("#" + dependentVariable + ".means");
    else
        mean = d3.select("#" + getValidId(level) + ".means");
        
    var c
