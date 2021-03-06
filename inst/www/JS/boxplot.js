var max, min, data, iqr, TOPFringe, BOTTOMFringe;

function makeBoxplot()
{
    //drawing
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
    
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;

    var canvas = d3.select("#plotCanvas");
    drawButtonInSideBar("DO SIGNIFICANCE TEST", "compareMean");
//     drawNavigator(["boxplot", "significance test", "result", "post-hoc pairwise"]);
    
    //initializations
    var variableList = sort(currentVariableSelection);
    
    var altBoxPlot = false;
    var data = [];
    var mins = [];
    var maxs = [];
    var iqrs = [];
    var medians = [];
    var means = [];
    var CIs = [];    
    var levels = [];
    var labels;
    var nGroovesX, nGroovesY;
    var ids = [];
    var widthOfEachBox;
    
    //for colour boxplot
    var levelsForColor;
    var levelsForXAxis;
    
    //get data
    if(currentVariableSelection.length > 1)
    {
        //if more than 2 variables are selected
        switch(variableList["independent"].length)
        {
            case 0:
                    {                        
                        for(var i=0; i<variableList["dependent"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"][i]]["dataset"];      
                            mins[i] = MIN[variableList["dependent"][i]]["dataset"];      
                            maxs[i] = MAX[variableList["dependent"][i]]["dataset"];      
                            means[i] = mean(data[i]);
                            medians[i] = median(data[i]);
                            iqrs[i] = IQR[variableList["dependent"][i]]["dataset"]; 
                            CIs[i] = CI[variableList["dependent"][i]]["dataset"]; 
                        }                      
                        break;                    
                    }
            case 1:
                    {
                        altBoxPlot = true;
                        for(var i=0; i<variableList["independent-levels"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"]][variableList["independent-levels"][i]];
                            mins[i] = MIN[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            maxs[i] = MAX[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            means[i] = mean(data[i]);
                            medians[i] = median(data[i]);
                            iqrs[i] = IQR[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            CIs[i] = CI[variableList["dependent"][0]][variableList["independent-levels"][i]];
                        }
                        break;
                    }
            case 2: 
                    {
                        altBoxPlot = true;
                        var splitData = splitThisLevelBy(variableList["independent"][0], variableList["independent"][1], variableList["dependent"][0]);
                        colourBoxPlotData = splitData;
                        var index = 0;
                        
                        drawBoxPlotLegends(variables[variableList["independent"][1]]["dataset"].unique());
                        
                        for(var i=0; i<variableList["independent-levels"][0].length; i++)
                        {
                            for(var j=0; j<variableList["independent-levels"][1].length; j++)
                            {   

                                levels.push(variableList["independent-levels"][0][i] + "-" + variableList["independent-levels"][1][j]);
                            
                                data[index] = splitData[variableList["independent-levels"][0][i]][variableList["independent-levels"][1][j]];                                
                                mins[index] = Array.min(data[index]);
                                maxs[index] = Array.max(data[index]);
                                means[index] = mean(data[index]);
                                medians[index] = median(data[index]);
                                iqrs[index] = findIQR(data[index]);
                                CIs[index] = findCI(data[index]);
                                
                                index++;
                                
                            }
                        }
                        
                        break;                        
                    }
            default:
                    {
                        //this shouldn't happen!
                    }
        }
    }
    else
    {
        data[0] = variables[currentVariableSelection[0]]["dataset"];      
        mins[0] = MIN[currentVariableSelection[0]]["dataset"];      
        maxs[0] = MAX[currentVariableSelection[0]]["dataset"];
        medians[0] = median(data[0]);
        iqrs[0] = IQR[currentVariableSelection[0]]["dataset"];
        CIs[0] = CI[currentVariableSelection[0]]["dataset"];
        means[0] = mean(data[0]);  
    }   
    
    min = Array.min(mins);
    max = Array.max(maxs);
    
    if(variableList["independent"].length == 1)    
        levels = variableList["independent-levels"]; //otherwise the arrays are contained into independent-levels
     
    //alt boxplot is the one with independent variable
    if(altBoxPlot)    
        labels = levels;
    else    
        labels = currentVariableSelection;
    
    ids = getValidIds(labels);
    
    nGroovesY = numberOfGrooves;
    
    // Draw axes        
    canvas.append("line")
            .attr("x1", LEFT)
            .attr("y1", BOTTOM + axesOffset)
            .attr("x2", RIGHT)
            .attr("y2", BOTTOM + axesOffset) 
            .attr("stroke", "black")
            .attr("id", "xAxis")
            .attr("class", "axes");
    
    canvas.append("line")
            .attr("x1", LEFT - axesOffset)
            .attr("y1", TOP)
            .attr("x2", LEFT - axesOffset)
            .attr("y2", BOTTOM)
            .attr("stroke", "black")
            .attr("id", "yAxis")
            .attr("class", "axes");
    
    //axes labels
    if(altBoxPlot)
    {
        canvas.append("text")
                .attr("x", canvasWidth/2 - plotWidth/2 - 1.25*labelOffset)
                .attr("y", (TOP + BOTTOM)/2)
                .attr("text-anchor", "middle")
                .attr("transform", "rotate (-90 " + (LEFT - axesOffset - 1.25*labelOffset) + " " + ((TOP + BOTTOM)/2) + ")")
                .attr("font-size", fontSizeLabels + "px")
                .text(variableList["dependent"][0])
                .attr("fill", "black");
    }
    
    //grooves
    
    //x-axis grooves           
    nGroovesX = labels.length;  
    widthOfEachBox = plotWidth/(labels.length*2) > boxWidth ? boxWidth : plotWidth/(labels.length*2);
    
    var xStep = plotWidth/nGroovesX;  
    var index = 0;
    for(i=0; i<nGroovesX; i++)
    {
        if(variableList["independent"].length == 2)
        {
            levelsForXAxis = variableList["independent-levels"][0];
            xStep = plotWidth/levelsForXAxis.length;  
            if(i<levelsForXAxis.length)
            {
                canvas.append("line")
                        .attr("x1", LEFT + index*xStep + xStep/2)
                        .attr("y1", BOTTOM  + axesOffset)
                        .attr("x2", LEFT + index*xStep + xStep/2)
                        .attr("y2", BOTTOM + tickLength + axesOffset)
                        .attr("stroke", "black");
    
                canvas.append("text")
                        .attr("x", LEFT + index*xStep + xStep/2)
                        .attr("y", BOTTOM + tickTextOffsetXAxis + axesOffset)                    
                        .text(levelsForXAxis[index])
                        .attr("fill", "black")
                        .attr("font-size", fontSizeTicks + "px")
                        .attr("text-anchor", "middle");
                        
                index++;
            }   
        }
        else
        {
            canvas.append("line")
                        .attr("x1", LEFT + i*xStep + xStep/2)
                        .attr("y1", BOTTOM  + axesOffset)
                        .attr("x2", LEFT + i*xStep + xStep/2)
                        .attr("y2", BOTTOM + tickLength + axesOffset)
                        .attr("id", ids[i])
                        .attr("class", "xAxisGrooves");
    
            canvas.append("text")
                        .attr("x", LEFT + i*xStep + xStep/2)
                        .attr("y", BOTTOM + tickTextOffsetXAxis + axesOffset)                    
                        .text(labels[i])
                        .attr("fill", "black")
                        .attr("font-size", fontSizeTicks + "px")
                        .attr("text-anchor", "middle")
                        .attr("id", ids[i])
                        .attr("class", "xAxisGrooveText");
        }
    }

    xStep = plotWidth/nGroovesX;  
    
    //y-axis grooves
    var yStep = plotHeight/(nGroovesY-1);
    var slice = (max - min)/(nGroovesY-1);    
    
    for(i=0; i<nGroovesY; i++)
    {
        canvas.append("line")
                    .attr("x1", LEFT - tickLength - axesOffset)
                    .attr("y1", BOTTOM - i*yStep)
                    .attr("x2", LEFT - axesOffset)
                    .attr("y2", BOTTOM - i*yStep)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
        
        yAxisTexts.push(canvas.append("text")
                    .attr("x", LEFT - tickTextOffsetYAxis - axesOffset)
                    .attr("y", BOTTOM - i*yStep + yAxisTickTextOffset)                    
                    .text(dec2(min + i*slice))
                    .attr("font-size", fontSizeTicks + "px")
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText"));
    }
    
    var widthSlice = plotWidth/(nGroovesX);
    
    for(var i=0; i<nGroovesX; i++)
    {
        if(data[i].length > 0)
        {
            var boxColor = boxColors["normal"];
        
            if(variableList["independent"].length == 2)
            {
                levelsForColor = variableList["independent-levels"][1];
                boxColor = colors[i%levelsForColor.length];
            }
        
            var rectBottom = (medians[i] - iqrs[i]/2) < min ? min : (medians[i] - iqrs[i]/2);
            var rectTop = (medians[i] + iqrs[i]/2) > max ? max : (medians[i] + iqrs[i]/2);
        
            boxes.push(canvas.append("rect")
                        .attr("x", LEFT + i*widthSlice - widthOfEachBox/2 + xStep/2)
                        .attr("y", BOTTOM - getFraction(rectTop)*plotHeight)
                        .attr("height", getFraction(rectTop)*plotHeight - getFraction(rectBottom)*plotHeight)
                        .attr("width", widthOfEachBox)
                        .attr("fill", boxColor)
                        .attr("stroke", "black")
                        .attr("id", ids[i])
                        .attr("class", "IQRs"));
                
            // median
            medianLines.push(canvas.append("line")
                        .attr("x1", LEFT + i*widthSlice - widthOfEachBox/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(medians[i])*plotHeight)
                        .attr("x2", LEFT + i*widthSlice + widthOfEachBox/2 + xStep/2)
                        .attr("y2", BOTTOM - getFraction(medians[i])*plotHeight)
                        .attr("id", ids[i])
                        .attr("class", "medians"));
    
            //end fringes
            BOTTOMFringe = (medians[i] - 1.5*iqrs[i]) < min ? min : (medians[i] - 1.5*iqrs[i]);
            TOPFringe = (medians[i] + 1.5*iqrs[i]) > max ? max : (medians[i] + 1.5*iqrs[i]);
    
            topFringes.push(canvas.append("line")
                        .attr("x1", canvasWidth/2 - widthOfEachBox/4 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(TOPFringe)*plotHeight)
                        .attr("x2", canvasWidth/2 + widthOfEachBox/4 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y2", BOTTOM - getFraction(TOPFringe)*plotHeight)
                        .attr("id", ids[i])
                        .attr("stroke-width", "2")
                        .attr("class", "TOPFringes"));
    
            topFringeConnectors.push(canvas.append("line")
                        .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(TOPFringe)*plotHeight)
                        .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y2", BOTTOM- getFraction(rectTop)*plotHeight)
                        .attr("id", ids[i])
                        .attr("class", "TOPFringeConnectors"));    
    
            bottomFringes.push(canvas.append("line")
                        .attr("x1", canvasWidth/2 - widthOfEachBox/4 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(BOTTOMFringe)*plotHeight)
                        .attr("x2", canvasWidth/2 + widthOfEachBox/4 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y2", BOTTOM - getFraction(BOTTOMFringe)*plotHeight)
                        .attr("id", ids[i])
                        .attr("stroke-width", "2")
                        .attr("class", "BOTTOMFringes"));
                
            bottomFringeConnectors.push(canvas.append("line")
                        .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(BOTTOMFringe)*plotHeight)
                        .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y2", BOTTOM - getFraction(rectBottom)*plotHeight)
                        .attr("id", ids[i])
                        .attr("class", "BOTTOMFringeConnectors"));
    
        
        
            CILines.push(canvas.append("line")
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y1", BOTTOM - getFraction(CIs[i][0])*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y2", BOTTOM - getFraction(CIs[i][1])*plotHeight)
                    .attr("stroke", "rosybrown")
                    .attr("stroke-width", "4")
                    .attr("id", ids[i])
                    .attr("class", "CIs"));
        
            CIBottomLines.push(canvas.append("line")
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 - CIFringeLength)
                    .attr("y1", BOTTOM - getFraction(CIs[i][0])*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 + CIFringeLength)
                    .attr("y2", BOTTOM - getFraction(CIs[i][0])*plotHeight)
                    .attr("stroke", "rosybrown")
                    .attr("stroke-width", "4")
                    .attr("id", ids[i])
                    .attr("class", "CIBottomFringes"));
        
            CITopLines.push(canvas.append("line")
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 - CIFringeLength)
                    .attr("y1", BOTTOM - getFraction(CIs[i][1])*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 + CIFringeLength)
                    .attr("y2", BOTTOM - getFraction(CIs[i][1])*plotHeight)
                    .attr("stroke", "rosybrown")
                    .attr("stroke-width", "4")
                    .attr("id", ids[i])
                    .attr("class", "CITopFringes"));
        
            var outliers = getOutliers(data[i], TOPFringe, BOTTOMFringe);
            
            for(var j=0; j<outliers.length; j++)
            {
                canvas.append("circle")
                        .attr("cx", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("cy", BOTTOM - getFraction(outliers[j])*plotHeight)
                        .attr("r", outlierRadius)
                        .attr("fill", "red")
                        .attr("stroke", "none")
                        .attr("id", ids[i] + j)
                        .attr("class", "outliers");
            }
        
            var dataAttributeForIndependentVariableA, dataAttributeForIndependentVariableB;
            if(variableList["independent"].length == 2)
            {
                dataAttributeForIndependentVariableA = variableList["independent"][0];
                dataAttributeForIndependentVariableB = variableList["independent"][1];
            }   

            meanCircles.push(canvas.append("circle")
                        .attr("cx", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("cy", BOTTOM - getFraction(means[i])*plotHeight)
                        .attr("r", meanRadius)
                        .attr("fill", meanColors["normal"])
                        .attr("style", "z-index: 5;")
                        .attr("id", ids[i])
                        .attr("class", "means")
                        .attr("data-indepenentVariableA", dataAttributeForIndependentVariableA)
                        .attr("data-indepenentVariableB", dataAttributeForIndependentVariableB)
                        .attr("data-levelA", (ids[i].split("-"))[0])
                        .attr("data-levelB", (ids[i].split("-"))[1]));
        }        
    }
}

function redrawBoxPlot()
{
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
    
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;

    var canvas = d3.select("#plotCanvas");
    
    //initializations
    var variableList = sort(currentVariableSelection);
    
    var altBoxPlot = false;
    var data = [];
    var mins = [];
    var maxs = [];
    var iqrs = [];
    var medians = [];
    var means = [];
    var CIs = [];    
    var levels = [];
    var labels;
    var nGroovesX, nGroovesY;
    var ids = [];
    var widthOfEachBox;
    
    //get data
    if(currentVariableSelection.length > 1)
    {
        //if more than 2 variables are selected
        switch(variableList["independent"].length)
        {
            case 0:
                    {
                        for(var i=0; i<variableList["dependent"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"][i]]["dataset"];      
                            mins[i] = MIN[variableList["dependent"][i]]["dataset"];      
                            maxs[i] = MAX[variableList["dependent"][i]]["dataset"];      
                            means[i] = mean(data[i]);
                            medians[i] = median(data[i]);
                            iqrs[i] = IQR[variableList["dependent"][i]]["dataset"]; 
                            CIs[i] = CI[variableList["dependent"][i]]["dataset"]; 
                        }
                        
                        break;                    
                    }
            case 1:
                    {
                        altBoxPlot = true;
                        for(var i=0; i<variableList["independent-levels"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"]][variableList["independent-levels"][i]];
                            mins[i] = MIN[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            maxs[i] = MAX[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            means[i] = mean(data[i]);
                            medians[i] = median(data[i]);
                            iqrs[i] = IQR[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            CIs[i] = CI[variableList["dependent"][0]][variableList["independent-levels"][i]];
                        }
                        break;
                    }
            case 2: 
                    {
                        altBoxPlot = true;
                        var splitData = splitThisLevelBy(variableList["independent"][0], variableList["independent"][1], variableList["dependent"][0]);
                        colourBoxPlotData = splitData;
                        var index = 0;
                        drawBoxPlotLegends(variables[variableList["independent"][1]]["dataset"].unique());
                        
                        for(var i=0; i<variableList["independent-levels"][0].length; i++)
                        {
                            for(var j=0; j<variableList["independent-levels"][1].length; j++)
                            {   

                                levels.push(variableList["independent-levels"][0][i] + "-" + variableList["independent-levels"][1][j]);
                            
                                data[index] = splitData[variableList["independent-levels"][0][i]][variableList["independent-levels"][1][j]];                                
                                mins[index] = Array.min(data[index]);
                                maxs[index] = Array.max(data[index]);
                                means[index] = mean(data[index]);
                                medians[index] = median(data[index]);
                                iqrs[index] = findIQR(data[index]);
                                CIs[index] = findCI(data[index]);
                                
                                index++;
                                
                            }
                        }
                        
                        break;                        
                    }
            default:
                    {
                        //this shouldn't happen!
                    }
        }
    }
    else
    {
        data[0] = variables[currentVariableSelection[0]]["dataset"];      
        mins[0] = MIN[currentVariableSelection[0]]["dataset"];      
        maxs[0] = MAX[currentVariableSelection[0]]["dataset"];
        medians[0] = median(data[0]);
        iqrs[0] = IQR[currentVariableSelection[0]]["dataset"];
        CIs[0] = CI[currentVariableSelection[0]]["dataset"];
        means[0] = mean(data[0]);  
    }   
    
    min = Array.min(mins);
    max = Array.max(maxs);
    
    if(variableList["independent"].length == 1)    
        levels = variableList["independent-levels"]; //otherwise the arrays are contained into independent-levels
     
    //alt boxplot is the one with independent variable
    if(altBoxPlot)    
        labels = levels;
    else    
        labels = currentVariableSelection;
    
    ids = getValidIds(labels);

    nGroovesY = numberOfGrooves;
    
    // Draw axes        
    canvas.append("line")
            .attr("x1", LEFT)
            .attr("y1", BOTTOM + axesOffset)
            .attr("x2", RIGHT)
            .attr("y2", BOTTOM + axesOffset) 
            .attr("stroke", "black")
            .attr("id", "xAxis")
            .attr("class", "axes");
    
    canvas.append("line")
            .attr("x1", LEFT - axesOffset)
            .attr("y1", TOP)
            .attr("x2", LEFT - axesOffset)
            .attr("y2", BOTTOM)
            .attr("stroke", "black")
            .attr("id", "yAxis")
            .attr("class", "axes");

    //axes labels
    if(altBoxPlot)
    {
        canvas.append("text")
                .attr("x", canvasWidth/2 - plotWidth/2 - 1.25*labelOffset)
                .attr("y", (TOP + BOTTOM)/2)
                .attr("text-anchor", "middle")
                .attr("transform", "rotate (-90 " + (LEFT - axesOffset - 1.25*labelOffset) + " " + ((TOP + BOTTOM)/2) + ")")
                .attr("font-size", fontSizeLabels + "px")
                .text(variableList["dependent"][0])
                .attr("fill", "black");
    }
    
    //x-axis grooves           
    nGroovesX = labels.length;    
    widthOfEachBox = plotWidth/(labels.length*2) > boxWidth ? boxWidth : plotWidth/(labels.length*2);
    
    var xStep = plotWidth/nGroovesX; 
    
    //y-axis grooves
    var yStep = plotHeight/(nGroovesY-1);
    var slice = (max - min)/(nGroovesY-1);    

    for(i=0; i<nGroovesY; i++)
    {
        yAxisTexts[i].transition().duration(boxPlotTransformationDuration)        
                    .attr("x", LEFT - tickTextOffsetYAxis - axesOffset)
                    .attr("y", BOTTOM - i*yStep + yAxisTickTextOffset)                    
                    .text(dec2(min + i*slice))
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    var widthSlice = plotWidth/(nGroovesX);
    
    for(var i=0; i<nGroovesX; i++)
    {
        if(data[i].length > 0)
        {
            var rectBottom = (medians[i] - iqrs[i]/2) < min ? min : (medians[i] - iqrs[i]/2);
            var rectTop = (medians[i] + iqrs[i]/2) > max ? max : (medians[i] + iqrs[i]/2);
        
            boxes[i].transition().duration(boxPlotTransformationDuration)
                        .attr("x", LEFT + i*widthSlice - widthOfEachBox/2 + xStep/2)
                        .attr("y", BOTTOM - getFraction(rectTop)*plotHeight)
                        .attr("height", getFraction(rectTop)*plotHeight - getFraction(rectBottom)*plotHeight)
                        .attr("width", widthOfEachBox)
                        .attr("fill", boxColors["normal"]);
                
            // median
            medianLines[i].transition().duration(boxPlotTransformationDuration)
                        .attr("x1", LEFT + i*widthSlice - widthOfEachBox/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(medians[i])*plotHeight)
                        .attr("x2", LEFT + i*widthSlice + widthOfEachBox/2 + xStep/2)
                        .attr("y2", BOTTOM - getFraction(medians[i])*plotHeight);
    
            //end fringes
            BOTTOMFringe = (medians[i] - 1.5*iqrs[i]) < min ? min : (medians[i] - 1.5*iqrs[i]);
            TOPFringe = (medians[i] + 1.5*iqrs[i]) > max ? max : (medians[i] + 1.5*iqrs[i]);
    
            topFringes[i].transition().duration(boxPlotTransformationDuration)
                        .attr("x1", canvasWidth/2 - widthOfEachBox/4 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(TOPFringe)*plotHeight)
                        .attr("x2", canvasWidth/2 + widthOfEachBox/4 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y2", BOTTOM - getFraction(TOPFringe)*plotHeight);
    
            topFringeConnectors[i].transition().duration(boxPlotTransformationDuration)
                        .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(TOPFringe)*plotHeight)
                        .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y2", BOTTOM- getFraction(rectTop)*plotHeight);    
    
            bottomFringes[i].transition().duration(boxPlotTransformationDuration)
                        .attr("x1", canvasWidth/2 - widthOfEachBox/4 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(BOTTOMFringe)*plotHeight)
                        .attr("x2", canvasWidth/2 + widthOfEachBox/4 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y2", BOTTOM - getFraction(BOTTOMFringe)*plotHeight);
                
            bottomFringeConnectors[i].transition().duration(boxPlotTransformationDuration)
                        .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(BOTTOMFringe)*plotHeight)
                        .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y2", BOTTOM - getFraction(rectBottom)*plotHeight);
    
            CILines[i].transition().duration(boxPlotTransformationDuration)
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y1", BOTTOM - getFraction(CIs[i][0])*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y2", BOTTOM - getFraction(CIs[i][1])*plotHeight);
        
            CIBottomLines[i].transition().duration(boxPlotTransformationDuration)
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 - CIFringeLength)
                    .attr("y1", BOTTOM - getFraction(CIs[i][0])*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 + CIFringeLength)
                    .attr("y2", BOTTOM - getFraction(CIs[i][0])*plotHeight);
        
            CITopLines[i].transition().duration(boxPlotTransformationDuration)
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 - CIFringeLength)
                    .attr("y1", BOTTOM - getFraction(CIs[i][1])*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 + CIFringeLength)
                    .attr("y2", BOTTOM - getFraction(CIs[i][1])*plotHeight);
        
            removeElementsByClassName("outliers");
    
            var outliers = getOutliers(data[i], TOPFringe, BOTTOMFringe);
            
            for(var j=0; j<outliers.length; j++)
            {
                canvas.append("circle")
                        .attr("cx", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("cy", BOTTOM - getFraction(outliers[j])*plotHeight)
                        .attr("r", outlierRadius)
                        .attr("fill", "red")
                        .attr("stroke", "none")
                        .attr("id", ids[i] + j)
                        .attr("class", "outliers");
            }
    
            meanCircles[i].transition().duration(boxPlotTransformationDuration)
                        .attr("cx", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("cy", BOTTOM - getFraction(means[i])*plotHeight);
        }        
    }
}

function drawHomogeneityPlot(homogeneity)
{    
    var color = "";
    
    if(homogeneity)
        color = "green";
    else
        color = "red";
        
    removeElementsByClassName("densityCurve");
    removeElementsByClassName("homogeneityPlot");
    
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
    
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;

    var canvas = d3.select("#plotCanvas");
    
    //initializations
    var variableList = sort(currentVariableSelection);
    
    var altBoxPlot = false;
    var data = [];
    var mins = [];
    var maxs = [];
    var iqrs = [];
    var medians = [];
    var means = [];
    var CIs = [];    
    var levels = [];
    var labels;
    var nGroovesX, nGroovesY;
    var ids = [];
    var widthOfEachBox;
    
    //get data
    if(currentVariableSelection.length > 1)
    {
        //if more than 2 variables are selected
        switch(variableList["independent"].length)
        {
            case 0:
                    {
                        for(var i=0; i<variableList["dependent"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"][i]]["dataset"];      
                            mins[i] = MIN[variableList["dependent"][i]]["dataset"];      
                            maxs[i] = MAX[variableList["dependent"][i]]["dataset"];      
                            means[i] = mean(data[i]);
                            medians[i] = median(data[i]);
                            iqrs[i] = IQR[variableList["dependent"][i]]["dataset"]; 
                            CIs[i] = CI[variableList["dependent"][i]]["dataset"]; 
                        }
                        
                        break;                    
                    }
            case 1:
                    {
                        altBoxPlot = true;
                        for(var i=0; i<variableList["independent-levels"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"]][variableList["independent-levels"][i]];
                            mins[i] = MIN[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            maxs[i] = MAX[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            means[i] = mean(data[i]);
                            medians[i] = median(data[i]);
                            iqrs[i] = IQR[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            CIs[i] = CI[variableList["dependent"][0]][variableList["independent-levels"][i]];
                        }
                        break;
                    }
            case 2: 
                    {
                        altBoxPlot = true;
                        var splitData = splitThisLevelBy(variableList["independent"][0], variableList["independent"][1], variableList["dependent"][0]);
                        colourBoxPlotData = splitData;
                        var index = 0;                        
                        for(var i=0; i<variableList["independent-levels"][0].length; i++)
                        {
                            for(var j=0; j<variableList["independent-levels"][1].length; j++)
                            {   

                                levels.push(variableList["independent-levels"][0][i] + "-" + variableList["independent-levels"][1][j]);
                            
                                data[index] = splitData[variableList["independent-levels"][0][i]][variableList["independent-levels"][1][j]];                                
                                mins[index] = Array.min(data[index]);
                                maxs[index] = Array.max(data[index]);
                                means[index] = mean(data[index]);
                                medians[index] = median(data[index]);
                                iqrs[index] = findIQR(data[index]);
                                CIs[index] = findCI(data[index]);
                                
                                index++;
                                
                            }
                        }
                        
                        break;                        
                    }
            default:
                    {
                        //this shouldn't happen!
                    }
        }
    }
    else
    {
        data[0] = variables[currentVariableSelection[0]]["dataset"];      
        mins[0] = MIN[currentVariableSelection[0]]["dataset"];      
        maxs[0] = MAX[currentVariableSelection[0]]["dataset"];
        medians[0] = median(data[0]);
        iqrs[0] = IQR[currentVariableSelection[0]]["dataset"];
        CIs[0] = CI[currentVariableSelection[0]]["dataset"];
        means[0] = mean(data[0]);  
    }   
    
    min = Array.min(mins);
    max = Array.max(maxs);
    
    if(variableList["independent"].length == 1)    
        levels = variableList["independent-levels"]; //otherwise the arrays are contained into independent-levels
     
    //alt boxplot is the one with independent variable
    if(altBoxPlot)    
        labels = levels;
    else    
        labels = currentVariableSelection;
    
    ids = getValidIds(labels);

    nGroovesY = numberOfGrooves;
    
    //grooves
    
    //x-axis grooves           
    nGroovesX = labels.length;    
    widthOfEachBox = plotWidth/(labels.length*2) > boxWidth ? boxWidth : plotWidth/(labels.length*2);
    
    var xStep = plotWidth/nGroovesX; 
    
    //y-axis grooves
    var yStep = plotHeight/(nGroovesY-1);
    var slice = (max - min)/(nGroovesY-1);   
    
    var widthSlice = plotWidth/(nGroovesX);
    var variances = [];
    
    var varianceMin = 999999;
    var varianceMax =-999999;
    
    for(var i=0; i<nGroovesX; i++)
    {
        if(data[i].length > 0)
        {
            if(mins[i] < varianceMin)
                varianceMin = mins[i];
            
            if(maxs[i] > varianceMax)
                varianceMax = maxs[i];
                
            variances.push(canvas.append("line")
                    .attr("x1", LEFT + i*widthSlice + xStep/2)
                    .attr("y1", BOTTOM - getFraction(mins[i])*plotHeight)
                    .attr("x2", LEFT + i*widthSlice + xStep/2)
                    .attr("y2", BOTTOM - getFraction(maxs[i])*plotHeight)
                    .attr("stroke-width", "3px")
                    .attr("stroke", "black")
                    .attr("class", "homogeneityPlot"));
        }        
    }
    
    canvas.transition().duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight*1.5);
    
    var variancePlotWidth = plotWidth/2;
    var variancePlotHeight = scaleForWindowSize(230);
    
    //make a small variance comparison plot
    var l = canvasWidth/2 - variancePlotWidth/2;
    var b = canvasHeight/2 + plotHeight/2 + 3*axesOffset + variancePlotHeight;
    
    canvas.append("line")
            .attr("x1", l)
            .attr("y1", b)
            .attr("x2", l)
            .attr("y2", b - variancePlotHeight)
            .attr("stroke", "black")
            .attr("class", "homogeneityPlot");
    
    canvas.append("line")
            .attr("x1", l)
            .attr("y1", b)
            .attr("x2", l + variancePlotWidth)
            .attr("y2", b)
            .attr("stroke", "black")
            .attr("class", "homogeneityPlot");
    
    canvas.append("text")
            .attr("x", l - axesOffset)
            .attr("y", b - variancePlotHeight/2)
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text("VARIANCE")
            .attr("font-size", scaleForWindowSize(12) + "px")
            .attr("transform", "rotate (-90 " + (l - axesOffset) + " " + (b - variancePlotHeight/2) + ")")
            .attr("class", "homogeneityPlot");    
    
    widthSlice = variancePlotWidth/(nGroovesX);
    xStep = variancePlotWidth/nGroovesX; 
    
    for(var i=0; i<nGroovesX; i++)
    {    
        canvas.append("text")
                .attr("x", l + i*widthSlice + xStep/2)
                .attr("y", b + 3*yAxisTickTextOffset)
                .attr("text-anchor", "end")
                .attr("font-size", scaleForWindowSize(12) + "px")
                .attr("transform", "rotate (-75 " + (l + i*widthSlice + xStep/2) + " " + (b + 3*yAxisTickTextOffset) + ")")
                .text(levels[i])
                .attr("class", "homogeneityPlot");
                
        variances[i].transition().delay(800).duration(800)
                        .attr("x1", l + i*widthSlice + xStep/2)
                        .attr("x2", l + i*widthSlice + xStep/2)
                        .attr("y1", b - getFractionForVariancePlot(varianceMin, varianceMin, varianceMax)*variancePlotHeight)
                        .attr("y2", b - getFractionForVariancePlot(varianceMin + (maxs[i] - mins[i]), varianceMin, varianceMax)*variancePlotHeight)
                        .attr("stroke-width", "7px")
                        .attr("stroke", color)
                        .attr("class", "homogeneityPlot");                        
    }
    
}

function drawBoxPlotInRed(level)
{
    level = getValidId(level);

    var box = d3.select("#" + level + ".IQRs");    
    box.attr("fill", boxColors["notnormal"]);
    
    var text = d3.select("#" + level + ".xAxisGrooveText");
    text.attr("fill", boxColors["notnormal"]);
}

function getFraction(number)
{
    return (number - min)/(max - min);
}

function getFractionForVariancePlot(number, min, max)
{
    return (number - min)/(max - min);
}

function getActualValue(fraction)
{
    var BOTTOM = canvasHeight/2 + plotHeight/2;
    return ((BOTTOM - fraction)/plotHeight)*(max-min) + min;
}

function getOutliers(data, TOPFringe, BOTTOMFringe)
{
    var outliers = [];
    
    for(var i=0; i<data.length; i++)
    {
        if((data[i] > (TOPFringe) )|| (data[i] < (BOTTOMFringe) ))
        {
            outliers.push(data[i]);
        }
    }   
    return outliers;
}

//Loop animation
function startLoopAnimation(meanCircle)
{
    var canvas = d3.select("#plotCanvas");
        
    //insert animation
    var loop = canvas.append("circle")
                  .attr("cx", meanCircle.attr("cx"))
                  .attr("cy", meanCircle.attr("cy"))
                  .attr("r", "0px")
                  .attr("fill", "none")
                  .attr("style", "z-index: -1;")
                  .attr("stroke", "black")
                  .attr("stroke-width", "2px")				
                  .attr("class", "loops");

    loop.transition().duration(1500).attr("r", "30px").attr("opacity", "0.25").attr("stroke","lightgrey");
    loop.transition().delay(2300).attr("opacity", "0");

    intervals[meanCircle.attr("id")] = setInterval(function()
    {						
       var loop = canvas.append("circle")
                     .attr("cx", meanCircle.attr("cx"))
                     .attr("cy", meanCircle.attr("cy"))
                     .attr("r", "0px")
                     .attr("fill", "none")
                     .attr("stroke", "black")
                     .attr("stroke-width", "2px")				
                     .attr("class", "loops");

       loop.transition().duration(1500).attr("r", "30px").attr("stroke", "grey");
       loop.transition().delay(1500).attr("opacity", "0");
//        loop.transition().delay(1500).duration(1000).attr("r", "45px").attr("opacity", "0");
    },1000);
}

function drawBoxPlotLegends(varNames)
{
    var canvas = d3.select("#sideBarCanvas");
    
    var yStep = plotHeight/10;
    
    for(var i=0; i<varNames.length; i++)
    {
        canvas.append("rect")
                .attr("x", sideBarWidth/4)
                .attr("y", TOP + histLegendOffsetY + i*yStep - histLegendSize/2)
                .attr("width", histLegendSize)
                .attr("height", histLegendSize)
                .attr("fill", colors[i])
                .attr("stroke", "black")
                .attr("id", "legend" + i)
                .attr("class", "boxplotLegends");
        
        canvas.append("text")
                .attr("x", sideBarWidth/2 + histLegendSize)
                .attr("y", TOP + histLegendOffsetY + i*yStep + 3)
                .attr("text-anchor", "start")
                .attr("fill", "black")
                .attr("font-size", fontSizeTicks + "px")
                .text(varNames[i])
                .attr("id", "legend" + i)
                .attr("class", "boxplotLegends");
            
    }
}

function selectAllMeans()
{    
    var lastMean = findEndingMean();
    var unSelectedMeans = getUnselectedMeansForColourBoxPlotData();
    
    var means = new Array();
    
    if(lastMean != 0)
        means.push(lastMean);
    
    for(var i=0; i<unSelectedMeans.length; i++)
        means.push(unSelectedMeans[i]);
        
    means.sort(function(a, b)
    {
        if(parseFloat(a.getAttribute("cx")) < parseFloat(b.getAttribute("cx")))
            return -1;
        if(parseFloat(a.getAttribute("cx")) > parseFloat(b.getAttribute("cx")))
            return 1;
        return 0;
    });

    var plotCanvas = d3.select("#plotCanvas");    
    for(var i=0; i<means.length; i++)
    {
        var mean = d3.select("#" + means[i].getAttribute("id") + ".means");
        mean.transition().duration(500).attr("fill", meanColors["click"]);
        
        if(i != means.length - 1)
        {
            var line = plotCanvas.append("line")
                        .attr("x1", means[i].getAttribute("cx"))
                        .attr("y1", means[i].getAttribute("cy"))
                        .attr("x2", means[i+1].getAttribute("cx"))
                        .attr("y2", means[i+1].getAttribute("cy"))
                        .attr("stroke", meanColors["click"])
                        .attr("opacity", "0.1")
                        .attr("stroke-dasharray", "5,5")
                        .attr("class", "completeLines");
            
            line.transition().delay(500).duration(500).attr("opacity", "1.0");
        }
    }
}

function unselectAllMeans()
{    
    var selectedMeans = getSelectedMeansForColourBoxPlotData();
    
    selectedMeans.sort(function(a, b)
    {
        if(a.getAttribute("cx") < b.getAttribute("cx"))
            return -1;
        if(a.getAttribute("cx") > b.getAttribute("cx"))
            return 1;
        return 0;
    });
    
    d3.selectAll(".means").transition().duration(500).attr("fill",meanColors["normal"]);
    
    removeElementsByClassName("completeLines");
    removeElementsByClassName("incompleteLines");
}