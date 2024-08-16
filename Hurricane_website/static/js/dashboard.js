// Fetch data from the server
fetch('/api/data')
    .then(response => response.json())
    .then(data => {
        renderCharts(data);
    });

document.addEventListener('DOMContentLoaded', function () {
    var settingsButton = document.getElementById('settings-button');
    var settingsModal = document.getElementById('settings-modal');
    var closeModal = document.querySelector('.modal .close');

    settingsButton.addEventListener('click', function () {
        settingsModal.style.display = 'block';
    });

    closeModal.addEventListener('click', function () {
        settingsModal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    var settingsForm = document.getElementById('settings-form');
    settingsForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var theme = document.getElementById('theme').value;
        var refreshRate = document.getElementById('refresh-rate').value;

        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }

        console.log('Data refresh rate set to:', refreshRate);

        settingsModal.style.display = 'none';
    });

});


document.addEventListener('DOMContentLoaded', function () {
    var displayButton = document.getElementById('predictions-button');

    displayButton.addEventListener('click', function () { 
        var monthDropdown = document.createElement('select');
        var months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        months.forEach(function (month, index) {
            var option = document.createElement('option');
            option.value = index + 1;
            option.textContent = month;
            monthDropdown.appendChild(option);
        });

        monthDropdown.addEventListener('change', function () {
            var selectedMonth = this.value;
            fetch('/api/data')
                .then(response => response.json())
                .then(data => {
                    var filteredData = data.filter(item => {
                        var date = new Date(item.ISO_TIME);
                        return date.getMonth() + 1 === parseInt(selectedMonth) && date.getFullYear() === 2024;
                    });

                    renderTable(filteredData);
                });
        });

        var contentDiv = document.getElementById('content');
        contentDiv.innerHTML = ''; // Clear existing content
        contentDiv.appendChild(monthDropdown);
    });

    var homeButton = document.getElementById('home-button');
    homeButton.addEventListener('click', function () {
        // Navigate to the main dashboard page
        window.location.href = 'dashboard';
    });

    function renderTable(data) {
        var table = document.createElement('table');
        table.classList.add('data-table'); // Add a CSS class for styling

        var headers = ['ISO_TIME', 'BASIN', 'SUBBASIN', 'LAT', 'LON', 'WMO_WIND', 'WMO_PRES', 'STORM_SPEED', 'STORM_DIR', 'DIST2LANDFALL', 'NEAREST_COUNTRY']; // Modified headers

        var headerRow = table.insertRow();
        headers.forEach(headerText => {
            var header = document.createElement('th');
            header.textContent = headerText;
            headerRow.appendChild(header);
        });

        data.forEach(item => {
            var row = table.insertRow();
            headers.forEach(key => {
                var cell = row.insertCell();
                cell.textContent = item[key];
            });
        });

        var contentDiv = document.getElementById('content');
        contentDiv.innerHTML = ''; // Clear existing content
        contentDiv.appendChild(table);
    }
});

function renderCharts(data) {
    var labels = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    var windSpeeds = new Array(12).fill(0);
    var pressures = new Array(12).fill(0);

    data.forEach(item => {
        var date = new Date(item.ISO_TIME);
        var month = date.getMonth();
        if (date.getFullYear() === 2024) {
            windSpeeds[month] += item.WMO_WIND;
            pressures[month] += item.WMO_PRES;
        }
    });

    var ctxBar = document.getElementById('bar-chart').getContext('2d');
    var barChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Wind Speed',
                data: windSpeeds,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    var ctxScatter = document.getElementById('scatter-plot').getContext('2d');
    var scatterPlot = new Chart(ctxScatter, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Pressure vs Wind Speed 2024',
                data: data.filter(item => new Date(item.ISO_TIME).getFullYear() === 2024)
                    .map(item => ({ x: item.WMO_PRES, y: item.WMO_WIND })),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            }
        }
    });

    var accuracyData = [
        { Month: '2024-01', Percentage: 11.376147 },
        { Month: '2024-02', Percentage: 4.862385 },
        { Month: '2024-03', Percentage: 10.733945 },
        { Month: '2024-04', Percentage: 6.055046 },
        { Month: '2024-05', Percentage: 9.908257 },
        { Month: '2024-06', Percentage: 6.788991 },
        { Month: '2024-07', Percentage: 9.174312 },
        { Month: '2024-08', Percentage: 7.614679 },
        { Month: '2024-09', Percentage: 8.348624 },
        { Month: '2024-10', Percentage: 8.440367 },
        { Month: '2024-11', Percentage: 7.522936 },
        { Month: '2024-12', Percentage: 9.174312 }
    ];

    var accuracyLabels = accuracyData.map(item => item.Month);
    var accuracyPercentages = accuracyData.map(item => item.Percentage);

    var ctxLine = document.getElementById('line-chart').getContext('2d');
    var lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: accuracyLabels,
            datasets: [{
                label: 'Hurricane Probability Per Month  (%)',
                data: accuracyPercentages,
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    var ctxStormSpeedDir = document.getElementById('storm-speed-dir-chart').getContext('2d');
    var stormSpeedDirChart = new Chart(ctxStormSpeedDir, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Storm Speed vs Storm Direction 2024',
                data: data.map(item => ({ x: item.STORM_DIR, y: item.STORM_SPEED })),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
