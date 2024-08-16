// Fetch data from the server
fetch('/api/data')
    .then(response => response.json())
    .then(data => {
        renderCharts(data);
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

    // Bar chart
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

    // Scatter plot
    var ctxScatter = document.getElementById('scatter-plot').getContext('2d');
    var scatterPlot = new Chart(ctxScatter, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Pressure vs Wind Speed',
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


document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
   
    var form = event.target;
    
    var formData = new FormData(form);
    fetch(form.action, {
        method: form.method,
        body: formData
    }).then(response => {
        if (response.ok) {
            document.getElementById('welcome-message').style.display = 'block';
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000); // Redirect to dashboard after showing the welcome message
        } else {
            alert('Login failed. Please check your username and password.');
        }
    });
});
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    

    var form = event.target;
    
    var formData = new FormData(form);
    fetch(form.action, {
        method: form.method,
        body: formData
    }).then(response => {
        if (response.ok) {
            document.getElementById('welcome-message').style.display = 'block';
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000); 
        } else {
            alert('Login failed. Please check your username and password.');
        }
    });
});
