function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel

    // Use `d3.json` to fetch the metadata for a sample

    var queryUrl = `http://127.0.0.1:5000/metadata/${sample}`;
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("");

    // Use `Object.entries` to add each key and value pair to the panel
    d3.json(queryUrl).then(function(metadata) {
        var edad = metadata.AGE;
        var etnicidad = metadata.ETHNICITY;
        var genero = metadata.GENDER;
        panel.append("panel-body").text("EDAD: ");
        panel.append("panel-body").text(edad);
        panel.append("panel-body").text("     -ETNICIDAD:   ");
        panel.append("panel-body").text(etnicidad);
        panel.append("panel-body").text("-    GENERO:      ");
        panel.append("panel-body").text(genero);
    });
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

}



function buildCharts(sample) {

    // Using `d3.json` to fetch the sample data for the plots
    var queryUrl = `http://127.0.0.1:5000/samples/${sample}`;

    //La Pie Chart ---------------------------------------------------------------------------------------
    d3.json(queryUrl).then(function(data) {

        // Grab values from the response json object to build the plots
        var otu_ids = data.otu_ids;
        var otu_labels = data.otu_labels;
        var sample_values = data.sample_values;

        var top_otu_ids = otu_ids.slice(0, 10);
        var top_otu_labels = otu_labels.slice(0, 10);
        var top_sample_values = sample_values.slice(0, 10);

        var trace1 = {
            labels: top_otu_ids,
            values: top_sample_values,
            hoverinfo: top_otu_labels,
            type: 'pie'
        };

        var data = [trace1];
        var layout = { title: "Top 10", };
        Plotly.newPlot("pie", data, layout);
    });

    //La de Burbuja -------------------------------------------------------------------------------------
    // Build a Bubble Chart using the sample data
    d3.json(queryUrl).then(function(data) {

        // Grab values from the response json object to build the plots
        var otu_ids = data.otu_ids;
        var otu_labels = data.otu_labels;
        var sample_values = data.sample_values;

        var trace1 = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: { color: otu_ids, size: sample_values }
        };
        var data = [trace1];
        var layout = { title: 'Bubble Chart', showlegend: false, };

        Plotly.newPlot('bubble', data, layout);
    });

}



function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}



function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();