document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('atsForm');
    let quill;

    if (form) {
        // Initialize Quill editor
        quill = new Quill('#editor-container', {
            theme: 'snow'
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const strength = document.getElementById('strength').value;
            const keywords = quill.getText().trim().split('\n').join(',');
            const keywordsPresent = document.getElementById('keywordsPresent').value;
            const keywordsNotPresent = document.getElementById('keywordsNotPresent').value;
            const graphicContent = document.getElementById('graphicContent').value;
            const fontStyle = document.getElementById('fontStyle').value;
            const fontSize = document.getElementById('fontSize').value;
            const margins = document.getElementById('margins').value;
            const contentSize = document.getElementById('contentSize').value;
            const atsScoreMin = document.getElementById('atsScoreMin').value;
            const atsScoreMax = document.getElementById('atsScoreMax').value;

            // Store data in localStorage
            localStorage.setItem('name', name);
            localStorage.setItem('email', email);
            localStorage.setItem('strength', strength);
            localStorage.setItem('keywords', keywords);
            localStorage.setItem('keywordsPresent', keywordsPresent);
            localStorage.setItem('keywordsNotPresent', keywordsNotPresent);
            localStorage.setItem('graphicContent', graphicContent);
            localStorage.setItem('fontStyle', fontStyle);
            localStorage.setItem('fontSize', fontSize);
            localStorage.setItem('margins', margins);
            localStorage.setItem('contentSize', contentSize);
            localStorage.setItem('atsScoreMin', atsScoreMin);
            localStorage.setItem('atsScoreMax', atsScoreMax);

            // Redirect to template.html
            window.location.href = 'template.html';
        });
    }

    if (window.location.pathname.endsWith('template.html')) {
        const name = localStorage.getItem('name');
        const email = localStorage.getItem('email');
        const strength = localStorage.getItem('strength');
        const keywords = localStorage.getItem('keywords');
        const keywordsPresent = localStorage.getItem('keywordsPresent');
        const keywordsNotPresent = localStorage.getItem('keywordsNotPresent');
        const graphicContent = localStorage.getItem('graphicContent');
        const fontStyle = localStorage.getItem('fontStyle');
        const fontSize = localStorage.getItem('fontSize');
        const margins = localStorage.getItem('margins');
        const contentSize = localStorage.getItem('contentSize');
        const atsScoreMin = localStorage.getItem('atsScoreMin');
        const atsScoreMax = localStorage.getItem('atsScoreMax');

        document.getElementById('reportName').textContent = name;
        document.getElementById('reportEmail').textContent = email;

        const strengthElement = document.getElementById('reportStrength');
        strengthElement.textContent = strength.charAt(0).toUpperCase() + strength.slice(1).replace('-', ' ');

        // Set fill width and color
        const fillElement = document.getElementById('fill');
        document.querySelector('.meter').classList.add(`strength-${strength}`);

        // Set keywords
        document.getElementById('reportKeywords').textContent = keywords;

        // Render the pie chart
        const ctx = document.getElementById('keywordsChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Keywords Present', 'Keywords Not Present'],
                datasets: [{
                    data: [keywordsPresent, keywordsNotPresent],
                    backgroundColor: ['green', 'red']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.raw !== null) {
                                    label += context.raw + '%';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });

        // Set ATS parameters
        const reportGraphicContent = document.getElementById('reportGraphicContent');
        if (graphicContent <= 30) {
            reportGraphicContent.textContent = graphicContent + '%';
            reportGraphicContent.classList.add('green');
        } else if (graphicContent <= 50) {
            reportGraphicContent.textContent = graphicContent + '%';
            reportGraphicContent.classList.add('yellow');
        } else {
            reportGraphicContent.textContent = graphicContent + '%';
            reportGraphicContent.classList.add('red');
        }

        const reportFontStyle = document.getElementById('reportFontStyle');
        reportFontStyle.textContent = fontStyle.charAt(0).toUpperCase() + fontStyle.slice(1);
        reportFontStyle.classList.add(fontStyle === 'pass' ? 'green' : 'red');

        const reportFontSize = document.getElementById('reportFontSize');
        reportFontSize.textContent = fontSize.charAt(0).toUpperCase() + fontSize.slice(1);
        reportFontSize.classList.add(fontSize === 'pass' ? 'green' : 'red');

        const reportMargins = document.getElementById('reportMargins');
        reportMargins.textContent = margins.charAt(0).toUpperCase() + margins.slice(1);
        reportMargins.classList.add(margins === 'pass' ? 'green' : 'red');

        const reportContentSize = document.getElementById('reportContentSize');
        if (contentSize <= 2000) {
            reportContentSize.textContent = contentSize + ' characters';
            reportContentSize.classList.add('green');
        } else if (contentSize <= 2500) {
            reportContentSize.textContent = contentSize + ' characters';
            reportContentSize.classList.add('yellow');
        } else {
            reportContentSize.textContent = contentSize + ' characters';
            reportContentSize.classList.add('red');
        }

        // Set ATS Score paragraph
        const atsScoreParagraph = document.getElementById('atsScoreParagraph');
        atsScoreParagraph.textContent = `Based on ATS parameters analysis and keyword strength, the ATS score will range from ${atsScoreMin} to ${atsScoreMax}.`;
    }
});

document.getElementById('download').addEventListener('click', function () {
    var element = document.getElementById('report');
    var opt = {
        margin:       0.5,
        filename:     'ATS_Analysis_Report.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
});
