import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';

import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
);

export function Chart({ chart, type }) {
    const { x, y } = chart;
    console.log('chart', chart)
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Chart',
            },
        },
    };

    const labels = x.data;

    const data = {
        labels,
        datasets: [
            {
                label: y.label,
                data: y.data,
                backgroundColor: 'rgba(0, 112, 243, 0.8)',
            },
        ],
    };

    return (
        <div style={{ width: '100%', height: '100%' }} >
            {type === 'bar' && (
                <Bar
                    options={options}
                    data={data}
                />
            )}
            {type === 'line' && (
                <Line
                    options={options}
                    data={data}
                />
            )}
            {type === 'pie' && (
                <Pie
                    options={options}
                    data={data}
                />
            )}
        </div>
    );
}
