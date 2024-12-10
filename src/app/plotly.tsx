import React from "react";
import Plot from "react-plotly.js";

const WordScatterPlot = ({ data }) => {
  if (!data || data.words.length === 0) return <div>No data to visualize</div>;

  const { words, coordinates } = data;

  return (
    <Plot
      data={[
        {
          x: coordinates.map((coord) => coord[0]),
          y: coordinates.map((coord) => coord[1]),
          mode: "markers+text",
          text: words,
          textposition: "top center",
          marker: {
            size: 12,
            color: "blue",
          },
        },
      ]}
      layout={{
        title: "Word Embedding Visualization",
        xaxis: { title: "X Coordinate" },
        yaxis: { title: "Y Coordinate" },
        width: 800,
        height: 600,
      }}
    />
  );
};

export default WordScatterPlot;