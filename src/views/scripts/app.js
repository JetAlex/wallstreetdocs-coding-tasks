class ModuleChart {
    constructor(props) {
        this.data = props.data.service_reports;

        const statusCodes = new Set();
        const statusText = new Set();

        this.data.forEach(item => statusCodes.has(item.status_code) ? false : statusCodes.add(item.status_code));
        this.data.forEach(item => statusText.has(item.status_text) ? false : statusText.add(item.status_text));

        this.uniqCodes = [...statusCodes];
        this.uniqText = [...statusText];

        this.writePie();
        this.writeBar();
    }

    writePie() {
        const ctx = document.getElementById('pie').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [...this.uniqCodes],
                datasets: [{
                    data: [...this.uniqCodes.map(code => this.data.filter(item => item.status_code === code).length)],
                    backgroundColor: [
                        'RED',
                        'GREEN',
                        'BLUE',
                        'YELLOW',
                        'PURPLE'
                    ],
                    borderColor: [
                        '#ccc',
                        '#ccc',
                        '#ccc',
                        '#ccc',
                        '#ccc',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    writeBar() {
        const ctx = document.getElementById('chart').getContext('2d');

        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [...this.uniqText.map(text => text.length > 15 ? text.slice(0, 19)+'...' : text)],
                datasets: [{
                    data: [...this.uniqText.map(code => this.data.filter(item => item.status_text === code).length)],
                    backgroundColor: [
                        'RED',
                        'GREEN',
                        'BLUE',
                        'YELLOW',
                        'PURPLE',
                        'RED',
                        'GREEN',
                        'BLUE',
                        'YELLOW',
                        'PURPLE',
                        'RED',
                        'GREEN',
                        'BLUE',
                        'YELLOW',
                        'PURPLE'
                    ],
                    borderColor: [
                        '#ccc',
                        '#ccc',
                        '#ccc',
                        '#ccc',
                        '#ccc',
                        '#ccc',
                        '#ccc',
                        '#ccc',
                        '#ccc',
                        '#ccc'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
}

window.app = {
    ModuleChart
}