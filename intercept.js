let processedQuestions = null;

function replaceTypeInQuestions(questions, typeMap) {
    return questions.map(question => {
        if (typeMap[question.type]) {
            question.type = typeMap[question.type];
        }
        return question;
    });
}

function pollQuestionsTag() {
    function checkQuestionsTag() {
        const questionsTag = document.querySelector('questions');

        if (questionsTag) {
            clearInterval(pollInterval);
            clearTimeout(stopPollingTimeout);
            const questionsData = questionsTag.getAttribute('v-bind:questions');
            const questionTypesData = questionsTag.getAttribute('v-bind:question-types');

            const questions = JSON.parse(questionsData);
            const questionTypes = JSON.parse(questionTypesData);

            const typeMap = Object.entries(questionTypes).reduce((acc, [key, value]) => {
                acc[value] = key.replace("QUESTION_TYPE_", "");
                return acc;
            }, {});

            processedQuestions = replaceTypeInQuestions(questions, typeMap);

            console.log('Processed Questions:', processedQuestions);
        } else {
            console.log('Questions tag not found yet. Still polling...');
        }
    }

    const pollInterval = setInterval(checkQuestionsTag, 50);
    const stopPollingTimeout = setTimeout(() => {
        clearInterval(pollInterval);
        console.log('Questions tag not found yet. Stopped polling.');
    }, 1000);
}

function renderQuestionsToText(questions) {
    const lines = [];
    const questionImageBaseUrl = 'https://ks.rsmu.ru/upload/l_btz_filequestion/';
    const answerImageBaseUrl = 'https://ks.rsmu.ru/upload/l_btz_fileanswer/';

    questions.forEach((question) => {
        const questionType = question['type'];

        if (question['images'] && question['images'].length > 0) {
            lines.push(`${questionType} ${question['text']}`);
            question['images'].forEach((image, index) => {
                lines.push(`КАРТИНКА ВОПРОСА ${index + 1}: ${questionImageBaseUrl}${image}`);
            });
        } else {
            lines.push(`${questionType} ${question['text']}`);
        }

        if (questionType === 'MATCHING') {
            const answers = question['answers'] || [];
            const answersDraggable = question['answers_draggable'] || [];

            answers.forEach((answer) => {
                const answerText = answer['answer'];
                const imageIds = answer['images'] ? answer['images'].join(', ') : '';
                if (imageIds) {
                    lines.push(`${answerText} (${answerImageBaseUrl}${imageIds})`);
                } else {
                    lines.push(answerText);
                }
            });

            const maxAnswerLength = Math.max(
                ...answers.map(a => a['answer'].length),
                ...answersDraggable.map(a => a['answer'].length)
            );
            lines.push('-'.repeat(maxAnswerLength));

            answersDraggable.forEach((answer) => {
                const answerText = answer['answer'];
                const imageIds = answer['images'] ? answer['images'].join(', ') : '';
                if (imageIds) {
                    lines.push(`${answerText} (${answerImageBaseUrl}${imageIds})`);
                } else {
                    lines.push(answerText);
                }
            });
        } else {
            question['answers'].forEach((answer) => {
                const answerText = answer['answer'];
                const imageIds = answer['images'] ? answer['images'].join(', ') : '';
                if (imageIds) {
                    lines.push(`${answerText} (${answerImageBaseUrl}${imageIds})`);
                } else {
                    lines.push(answerText);
                }
            });
        }

        lines.push('');
    });

    return lines.join('\n');
}

function createDownloadButton(buttonText, fileType) {
    const downloadButton = document.createElement('input');
    downloadButton.type = 'button';
    downloadButton.value = buttonText;
    downloadButton.className = 'button is-primary mb-4';
    downloadButton.style.userSelect = 'auto';
    downloadButton.style.padding = '7px 16px'
    downloadButton.style.marginTop = '32px';
    downloadButton.style.marginRight = '4px';

    downloadButton.addEventListener('click', () => {
        let data = '';
        if (fileType === 'json') {
            data = JSON.stringify(processedQuestions, null, 2);
        } else {
            data = renderQuestionsToText(processedQuestions);
        }
        const blob = new Blob([data], { type: fileType === 'json' ? 'application/json' : 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `processed_test.${fileType}`;
        a.click();

        URL.revokeObjectURL(url);
    });

    return downloadButton;
}

function appendDownloadButtons() {
    const closeButtonDiv = document.querySelector('div[data-v-08b4d270] input[name="close_btn"]').parentElement;
    if (closeButtonDiv) {
        const txtButton = createDownloadButton('Скачать (TXT)', 'txt');
        const jsonButton = createDownloadButton('Скачать (JSON)', 'json');
        
        closeButtonDiv.insertAdjacentElement('afterend', txtButton);
        txtButton.insertAdjacentElement('afterend', jsonButton);
    } else {
        console.error('Close button not found');
    }
}

if (window.location.pathname === '/tests2/questions') {
    pollQuestionsTag();

    window.addEventListener('load', function () {
        appendDownloadButtons();
    });
}