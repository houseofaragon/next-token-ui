import React, { useEffect, useRef } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { select } from "d3-selection";
import { axisLeft } from "d3-axis";
import { max } from "d3-array";

const BarChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!data) return;

    const { top_tokens, top_probabilities } = data;

    const width = 600;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 40, left: 80 };

    const svg = select(chartRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create a chart group that will contain the bars and axes
    const chartGroup = svg
      .selectAll("g")
      .data([1])
      .join("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Scales for X and Y
    const x = scaleLinear()
      .domain([0, max(top_probabilities)]) // Max value for probabilities
      .nice()
      .range([0, width - margin.left - margin.right]);

    const y = scaleBand()
      .domain(top_tokens)
      .range([0, height - margin.top - margin.bottom])
      .padding(0.1);

    // Enter-Update-Exit pattern for bars
    const bars = chartGroup
      .selectAll(".bar")
      .data(top_tokens.map((token, i) => ({ token, probability: top_probabilities[i] })), (d) => d.token);

    // Enter phase: Add new bars
    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (d) => y(d.token))
      .attr("width", (d) => x(d.probability))
      .attr("height", y.bandwidth())
      .attr("fill", "green");

    // Update phase: Update existing bars
    bars
      .attr("x", 0)
      .attr("y", (d) => y(d.token))
      .attr("width", (d) => x(d.probability))
      .attr("height", y.bandwidth());

    // Exit phase: Remove old bars if necessary
    bars.exit().remove();

    // Add probability text inside the bars (right-aligned)
    const texts = chartGroup
      .selectAll(".probability-text")
      .data(top_tokens.map((token, i) => ({ token, probability: top_probabilities[i] })), (d) => d.token);

    // Enter phase: Append text elements
    texts
      .enter()
      .append("text")
      .attr("class", "probability-text")
      .attr("x", (d) => x(d.probability)) // Position text at the right edge of the bar
      .attr("y", (d) => y(d.token) + y.bandwidth() / 2) // Vertically center the text inside the bar
      .attr("dy", "0.35em") // Vertical alignment of the text (centered)
      .attr("text-anchor", "end") // Right-align the text at the end of the bar
      .attr("fill", "white") // Text color (white for contrast against the bar)
      .attr("font-size", "14px")
      .text((d) => d.probability.toFixed(2)); // Display probability with 2 decimal places

    // Update phase: Update text for existing bars
    texts
      .attr("x", (d) => x(d.probability) + 45) // Ensure text is at the right edge of the updated bar
      .attr("y", (d) => y(d.token) + y.bandwidth() / 2)
      .text((d) => d.probability.toFixed(2) + '%');

    // Exit phase: Remove old text elements if necessary
    texts.exit().remove();

    chartGroup
      .selectAll(".y-axis")
      .data([1])
      .join("g")
      .attr("class", "y-axis")
      .call(axisLeft(y))
  }, [data]); // Re-run the effect when `data` changes

  return <svg ref={chartRef} />;
};

export default BarChart;
