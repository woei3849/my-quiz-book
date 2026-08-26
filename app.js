// ========================================
// 나의 문제집
// app.js
// questions.json을 불러오는 버전
// ========================================


// ========================================
// 전역 변수
// ========================================

let questions = [];

let wrongAnswers =
    JSON.parse(
        localStorage.getItem("wrongAnswers")
    ) || [];

window.currentQuestion = null;


// ========================================
// questions.json 불러오기
// ========================================

async function loadQuestions() {

    try {

        const response = await fetch(
            "questions.json?version=" + Date.now()
        );

        if (!response.ok) {

            throw new Error(
                "questions.json을 불러오지 못했습니다."
            );

        }

        questions = await response.json();

        console.log(
            "문제 불러오기 완료:",
            questions.length,
            "개"
        );

        // 문제 데이터가 정상적으로 배열인지 확인
        if (!Array.isArray(questions)) {

            throw new Error(
                "questions.json의 최상위 구조는 배열 [ ] 이어야 합니다."
            );

        }

        showHome("past");

    }

    catch (error) {

        console.error(error);

        document
            .getElementById("pastContent")
            .innerHTML = `

                <div class="empty">

                    <strong>
                        문제 데이터를 불러오지 못했습니다.
                    </strong>

                    <br><br>

                    questions.json 파일이
                    index.html과 같은 위치에 있는지 확인해주세요.

                    <br><br>

                    파일 이름은 정확히
                    <strong>questions.json</strong>
                    이어야 합니다.

                </div>

            `;

    }

}


// ========================================
// 화면 숨기기
// ========================================

function hideScreens() {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove("active");

        });

}


// ========================================
// 기출 / 이론 화면
// ========================================

function showHome(type) {

    hideScreens();

    if (type === "past") {

        document
            .getElementById("pastScreen")
            .classList.add("active");

        showPastSubjects();

    }

    else if (type === "theory") {

        document
            .getElementById("theoryScreen")
            .classList.add("active");

        showTheorySubjects();

    }

}


// ========================================
// 기출
// 과목
// ========================================

function showPastSubjects() {

    const subjects = [
        ...new Set(

            questions

                .filter(q =>
                    q.section === "기출"
                )

                .map(q =>
                    q.subject
                )

                .filter(subject =>
                    subject
                )

        )
    ];


    let html = "";


    if (subjects.length === 0) {

        html += `

            <div class="empty">
                등록된 기출 문제가 없습니다.
            </div>

        `;

    }


    subjects.forEach(subject => {

        html += `

            <button
                class="menu-button"
                onclick="showExamTypes('${escapeQuotes(subject)}')">

                📖 ${subject}

            </button>

        `;

    });


    document
        .getElementById("pastContent")
        .innerHTML = html;

}


// ========================================
// 기출
// 국가직 / 지방직
// ========================================

function showExamTypes(subject) {

    const examTypes = [
        ...new Set(

            questions

                .filter(q =>
                    q.section === "기출" &&
                    q.subject === subject
                )

                .map(q =>
                    q.examType
                )

                .filter(type =>
                    type
                )

        )
    ];


    let html = `

        <button
            class="back-button"
            onclick="showPastSubjects()">

            ← 과목

        </button>

        <h2>${subject}</h2>

    `;


    if (examTypes.length === 0) {

        html += `

            <div class="empty">
                등록된 시험종류가 없습니다.
            </div>

        `;

    }


    examTypes.forEach(examType => {

        html += `

            <button
                class="menu-button"
                onclick="showYears(
                    '${escapeQuotes(subject)}',
                    '${escapeQuotes(examType)}'
                )">

                📝 ${examType}

            </button>

        `;

    });


    document
        .getElementById("pastContent")
        .innerHTML = html;

}


// ========================================
// 기출
// 연도
// ========================================

function showYears(
    subject,
    examType
) {

    const years = [
        ...new Set(

            questions

                .filter(q =>
                    q.section === "기출" &&
                    q.subject === subject &&
                    q.examType === examType
                )

                .map(q =>
                    String(q.year)
                )

                .filter(year =>
                    year
                )

        )
    ];


    let html = `

        <button
            class="back-button"
            onclick="showExamTypes(
                '${escapeQuotes(subject)}'
            )">

            ← 시험종류

        </button>

        <h2>
            ${subject} · ${examType}
        </h2>

    `;


    if (years.length === 0) {

        html += `

            <div class="empty">
                등록된 연도가 없습니다.
            </div>

        `;

    }


    years.forEach(year => {

        html += `

            <button
                class="menu-button"
                onclick="showQuestions(
                    '${escapeQuotes(subject)}',
                    '${escapeQuotes(examType)}',
                    '${escapeQuotes(year)}'
                )">

                📅 ${year}년

            </button>

        `;

    });


    document
        .getElementById("pastContent")
        .innerHTML = html;

}


// ========================================
// 기출
// 문제 목록
// ========================================

function showQuestions(
    subject,
    examType,
    year
) {

    const list = questions.filter(q =>

        q.section === "기출" &&

        q.subject === subject &&

        q.examType === examType &&

        String(q.year) === String(year)

    );


    let html = `

        <button
            class="back-button"
            onclick="showYears(
                '${escapeQuotes(subject)}',
                '${escapeQuotes(examType)}'
            )">

            ← 연도

        </button>

        <h2>
            ${year}년 ${examType}
        </h2>

    `;


    if (list.length === 0) {

        html += `

            <div class="empty">
                이 조건에 해당하는 문제가 없습니다.
            </div>

        `;

    }


    list.forEach(q => {

        html += `

            <button
                class="menu-button"
                onclick="openQuestion('${q.id}')">

                ${q.number}

            </button>

        `;

    });


    document
        .getElementById("pastContent")
        .innerHTML = html;

}


// ========================================
// 이론
// 과목
// ========================================

function showTheorySubjects() {

    const subjects = [
        ...new Set(

            questions

                .filter(q =>
                    q.section === "이론"
                )

                .map(q =>
                    q.subject
                )

                .filter(subject =>
                    subject
                )

        )
    ];


    let html = "";


    if (subjects.length === 0) {

        html += `

            <div class="empty">
                등록된 이론 문제가 없습니다.
            </div>

        `;

    }


    subjects.forEach(subject => {

        html += `

            <button
                class="menu-button"
                onclick="showTheoryUnits('${escapeQuotes(subject)}')">

                📖 ${subject}

            </button>

        `;

    });


    document
        .getElementById("theoryContent")
        .innerHTML = html;

}


// ========================================
// 이론
// 단원
// ========================================

function showTheoryUnits(subject) {

    const units = [
        ...new Set(

            questions

                .filter(q =>
                    q.section === "이론" &&
                    q.subject === subject
                )

                .map(q =>
                    q.unit
                )

                .filter(unit =>
                    unit && String(unit).trim() !== ""
                )

        )
    ];


    let html = `

        <button
            class="back-button"
            onclick="showTheorySubjects()">

            ← 과목

        </button>

        <h2>${subject}</h2>

    `;


    if (units.length === 0) {

        html += `

            <div class="empty">

                아직 등록된 단원이 없습니다.

                <br><br>

                questions.json의
                <strong>unit</strong>에
                단원명을 입력해주세요.

            </div>

        `;

    }


    units.forEach(unit => {

        html += `

            <button
                class="menu-button"
                onclick="showTheoryQuestions(
                    '${escapeQuotes(subject)}',
                    '${escapeQuotes(unit)}'
                )">

                📂 ${unit}

            </button>

        `;

    });


    document
        .getElementById("theoryContent")
        .innerHTML = html;

}


// ========================================
// 이론
// 문제 목록
// ========================================

function showTheoryQuestions(
    subject,
    unit
) {

    const list = questions.filter(q =>

        q.section === "이론" &&

        q.subject === subject &&

        q.unit === unit

    );


    let html = `

        <button
            class="back-button"
            onclick="showTheoryUnits(
                '${escapeQuotes(subject)}'
            )">

            ← 단원

        </button>

        <h2>${unit}</h2>

    `;


    if (list.length === 0) {

        html += `

            <div class="empty">
                이 단원에 등록된 문제가 없습니다.
            </div>

        `;

    }


    list.forEach(q => {

        html += `

            <button
                class="menu-button"
                onclick="openQuestion('${q.id}')">

                ${q.number}

            </button>

        `;

    });


    document
        .getElementById("theoryContent")
        .innerHTML = html;

}


// ========================================
// 문제 풀기
// 객관식 + 주관식
// ========================================

function openQuestion(id) {

    const q =
        questions.find(
            question =>
                String(question.id) === String(id)
        );


    if (!q) {

        console.error(
            "문제를 찾을 수 없습니다. id:",
            id
        );

        return;

    }


    window.currentQuestion = q;


    let html = `

        <button
            class="back-button"
            onclick="goBackToList()">

            ← 문제 목록

        </button>


        <div class="card">

            <div class="question-number">
                ${q.number || ""}
            </div>

            <div class="question-text">
                ${q.question || ""}
            </div>

    `;


    // ====================================
    // 주관식
    // type: short
    // 또는 type: 주관식
    // ====================================

    if (
        q.type === "short" ||
        q.type === "주관식"
    ) {

        html += `

            <input
                type="text"
                id="subjectiveAnswer"
                class="subjective-answer"
                placeholder="답을 입력하세요">

            <button
                class="submit-button"
                onclick="answerSubjectiveQuestion('${q.id}')">

                정답 확인

            </button>

            <div id="feedback"></div>

        `;

    }


    // ====================================
    // 객관식
    // ====================================

    else {

        html += `

            <div id="choices">

        `;


        const choices =
            Array.isArray(q.choices)
                ? q.choices
                : [];


        choices.forEach(
            (choice, index) => {

                html += `

                    <button
                        class="choice"
                        id="choice-${index}"
                        onclick="answerQuestion(
                            '${q.id}',
                            ${index}
                        )">

                        ${index + 1}. ${choice}

                    </button>

                `;

            }
        );


        html += `

            </div>

            <div id="feedback"></div>

        `;

    }


    html += `

        </div>

    `;


    if (q.section === "기출") {

        document
            .getElementById("pastContent")
            .innerHTML = html;

    }

    else {

        document
            .getElementById("theoryContent")
            .innerHTML = html;

    }

}


// ========================================
// 객관식 정답 확인
// ========================================

function answerQuestion(
    id,
    selectedIndex
) {

    const q =
        questions.find(
            question =>
                String(question.id) === String(id)
        );


    if (!q) return;


    document
        .querySelectorAll(
            "#choices .choice"
        )
        .forEach(button => {

            button.disabled = true;

        });


    const selected =
        document.getElementById(
            "choice-" +
            selectedIndex
        );


    const answerIndex =
        Number(q.answer);


    const correct =
        document.getElementById(
            "choice-" +
            answerIndex
        );


    if (
        selectedIndex === answerIndex
    ) {

        if (selected) {

            selected
                .classList
                .add("correct");

        }

    }

    else {

        if (selected) {

            selected
                .classList
                .add("wrong");

        }

        if (correct) {

            correct
                .classList
                .add("correct");

        }

        saveWrong(q);

    }


    document
        .getElementById("feedback")
        .innerHTML = `

        <div class="answer-label">

            정답: ${answerIndex + 1}번

        </div>

        <div class="explanation">

            <strong>해설</strong>

            <br><br>

            ${q.explanation || "해설이 없습니다."}

        </div>

    `;

}


// ========================================
// 주관식 정답 확인
// ========================================

function answerSubjectiveQuestion(id) {

    const q =
        questions.find(
            question =>
                String(question.id) === String(id)
        );


    if (!q) return;


    const input =
        document.getElementById(
            "subjectiveAnswer"
        );


    if (!input) return;


    const userAnswer =
        input.value.trim();


    if (userAnswer === "") {

        alert("답을 입력해주세요.");

        return;

    }


    input.disabled = true;


    // answerText가 있으면 answerText 사용
    // 없으면 answer 사용
    const correctAnswer =
        String(
            q.answerText !== undefined
                ? q.answerText
                : q.answer !== undefined
                    ? q.answer
                    : ""
        ).trim();


    const isCorrect =
        userAnswer.toLowerCase() ===
        correctAnswer.toLowerCase();


    if (isCorrect) {

        input.style.borderColor =
            "#3b82f6";

    }

    else {

        input.style.borderColor =
            "#ef4444";

        saveWrong(q);

    }


    const submitButton =
        document.querySelector(
            ".submit-button"
        );


    if (submitButton) {

        submitButton.disabled = true;

    }


    document
        .getElementById("feedback")
        .innerHTML = `

        <div class="answer-label">

            ${
                isCorrect
                    ? "⭕ 정답입니다!"
                    : "❌ 오답입니다."
            }

            <br><br>

            정답: ${correctAnswer}

        </div>


        <div class="explanation">

            <strong>해설</strong>

            <br><br>

            ${q.explanation || "해설이 없습니다."}

        </div>

    `;

}


// ========================================
// 오답 저장
// ========================================

function saveWrong(q) {

    const exists =
        wrongAnswers.some(
            x =>
                String(x.id) === String(q.id)
        );


    if (!exists) {

        wrongAnswers.push(q);

        localStorage.setItem(
            "wrongAnswers",
            JSON.stringify(
                wrongAnswers
            )
        );

    }

}


// ========================================
// 오답 화면
// ========================================

function showWrong() {

    hideScreens();

    document
        .getElementById("wrongScreen")
        .classList
        .add("active");

    showWrongSubjects();

}


// ========================================
// 오답
// 과목
// ========================================

function showWrongSubjects() {

    const subjects = [
        ...new Set(

            wrongAnswers
                .map(q =>
                    q.subject
                )

                .filter(subject =>
                    subject
                )

        )
    ];


    let html = `

        <h2>오답</h2>

    `;


    if (subjects.length === 0) {

        html += `

            <div class="empty">

                아직 틀린 문제가 없습니다.

            </div>

        `;

    }

    else {

        subjects.forEach(subject => {

            html += `

                <button
                    class="menu-button"
                    onclick="showWrongExamTypes(
                        '${escapeQuotes(subject)}'
                    )">

                    📖 ${subject}

                </button>

            `;

        });

    }


    document
        .getElementById("wrongContent")
        .innerHTML = html;

}


// ========================================
// 오답
// 국가직 / 지방직
// ========================================

function showWrongExamTypes(subject) {

    const examTypes = [
        ...new Set(

            wrongAnswers

                .filter(q =>
                    q.subject === subject
                )

                .map(q =>
                    q.examType
                )

                .filter(type =>
                    type
                )

        )
    ];


    let html = `

        <button
            class="back-button"
            onclick="showWrongSubjects()">

            ← 과목

        </button>

        <h2>${subject}</h2>

    `;


    if (examTypes.length === 0) {

        html += `

            <div class="empty">
                기출 오답이 없습니다.
            </div>

        `;

    }


    examTypes.forEach(examType => {

        html += `

            <button
                class="menu-button"
                onclick="showWrongYears(
                    '${escapeQuotes(subject)}',
                    '${escapeQuotes(examType)}'
                )">

                📝 ${examType}

            </button>

        `;

    });


    document
        .getElementById("wrongContent")
        .innerHTML = html;

}


// ========================================
// 오답
// 연도
// ========================================

function showWrongYears(
    subject,
    examType
) {

    const years = [
        ...new Set(

            wrongAnswers

                .filter(q =>
                    q.subject === subject &&
                    q.examType === examType
                )

                .map(q =>
                    String(q.year)
                )

                .filter(year =>
                    year
                )

        )
    ];


    let html = `

        <button
            class="back-button"
            onclick="showWrongExamTypes(
                '${escapeQuotes(subject)}'
            )">

            ← 시험종류

        </button>

        <h2>
            ${subject} · ${examType}
        </h2>

    `;


    years.forEach(year => {

        html += `

            <button
                class="menu-button"
                onclick="showWrongQuestions(
                    '${escapeQuotes(subject)}',
                    '${escapeQuotes(examType)}',
                    '${escapeQuotes(year)}'
                )">

                📅 ${year}년

            </button>

        `;

    });


    document
        .getElementById("wrongContent")
        .innerHTML = html;

}


// ========================================
// 오답
// 문제 목록
// ========================================

function showWrongQuestions(
    subject,
    examType,
    year
) {

    const list = wrongAnswers.filter(q =>

        q.subject === subject &&

        q.examType === examType &&

        String(q.year) === String(year)

    );


    let html = `

        <button
            class="back-button"
            onclick="showWrongYears(
                '${escapeQuotes(subject)}',
                '${escapeQuotes(examType)}'
            )">

            ← 연도

        </button>

        <h2>
            ${year}년 ${examType}
        </h2>

    `;


    list.forEach(q => {

        html += `

            <button
                class="menu-button"
                onclick="openWrongQuestion('${q.id}')">

                ${q.number}

            </button>

        `;

    });


    document
        .getElementById("wrongContent")
        .innerHTML = html;

}


// ========================================
// 오답 문제 풀기
// ========================================

function openWrongQuestion(id) {

    const q =
        wrongAnswers.find(
            question =>
                String(question.id) === String(id)
        );


    if (!q) return;


    window.currentQuestion = q;


    let html = `

        <button
            class="back-button"
            onclick="showWrongQuestions(
                '${escapeQuotes(q.subject)}',
                '${escapeQuotes(q.examType)}',
                '${escapeQuotes(q.year)}'
            )">

            ← 문제 목록

        </button>


        <div class="card">

            <div class="question-number">
                ${q.number || ""}
            </div>


            <div class="question-text">
                ${q.question || ""}
            </div>

    `;


    // ====================================
    // 오답 주관식
    // ====================================

    if (
        q.type === "short" ||
        q.type === "주관식"
    ) {

        html += `

            <input
                type="text"
                id="wrongSubjectiveAnswer"
                class="subjective-answer"
                placeholder="답을 입력하세요">

            <button
                class="submit-button"
                onclick="answerWrongSubjectiveQuestion(
                    '${q.id}'
                )">

                정답 확인

            </button>

            <div id="wrongFeedback"></div>

        `;

    }


    // ====================================
    // 오답 객관식
    // ====================================

    else {

        html += `

            <div id="wrongChoices">

        `;


        const choices =
            Array.isArray(q.choices)
                ? q.choices
                : [];


        choices.forEach(
            (choice, index) => {

                html += `

                    <button
                        class="choice"
                        id="wrong-choice-${index}"
                        onclick="answerWrongQuestion(
                            '${q.id}',
                            ${index}
                        )">

                        ${index + 1}. ${choice}

                    </button>

                `;

            }
        );


        html += `

            </div>

            <div id="wrongFeedback"></div>

        `;

    }


    html += `

        </div>

    `;


    document
        .getElementById("wrongContent")
        .innerHTML = html;

}


// ========================================
// 오답 객관식 정답 확인
// ========================================

function answerWrongQuestion(
    id,
    selectedIndex
) {

    const q =
        wrongAnswers.find(
            question =>
                String(question.id) === String(id)
        );


    if (!q) return;


    document
        .querySelectorAll(
            "#wrongChoices .choice"
        )
        .forEach(button => {

            button.disabled = true;

        });


    const selected =
        document.getElementById(
            "wrong-choice-" +
            selectedIndex
        );


    const answerIndex =
        Number(q.answer);


    const correct =
        document.getElementById(
            "wrong-choice-" +
            answerIndex
        );


    if (
        selectedIndex === answerIndex
    ) {

        if (selected) {

            selected
                .classList
                .add("correct");

        }

    }

    else {

        if (selected) {

            selected
                .classList
                .add("wrong");

        }

        if (correct) {

            correct
                .classList
                .add("correct");

        }

    }


    document
        .getElementById("wrongFeedback")
        .innerHTML = `

        <div class="answer-label">

            정답: ${answerIndex + 1}번

        </div>


        <div class="explanation">

            <strong>해설</strong>

            <br><br>

            ${q.explanation || "해설이 없습니다."}

        </div>

    `;

}


// ========================================
// 오답 주관식 정답 확인
// ========================================

function answerWrongSubjectiveQuestion(id) {

    const q =
        wrongAnswers.find(
            question =>
                String(question.id) === String(id)
        );


    if (!q) return;


    const input =
        document.getElementById(
            "wrongSubjectiveAnswer"
        );


    if (!input) return;


    const userAnswer =
        input.value.trim();


    if (userAnswer === "") {

        alert("답을 입력해주세요.");

        return;

    }


    input.disabled = true;


    const correctAnswer =
        String(
            q.answerText !== undefined
                ? q.answerText
                : q.answer !== undefined
                    ? q.answer
                    : ""
        ).trim();


    const isCorrect =
        userAnswer.toLowerCase() ===
        correctAnswer.toLowerCase();


    if (isCorrect) {

        input.style.borderColor =
            "#3b82f6";

    }

    else {

        input.style.borderColor =
            "#ef4444";

    }


    const submitButton =
        document.querySelector(
            ".submit-button"
        );


    if (submitButton) {

        submitButton.disabled = true;

    }


    document
        .getElementById("wrongFeedback")
        .innerHTML = `

        <div class="answer-label">

            ${
                isCorrect
                    ? "⭕ 정답입니다!"
                    : "❌ 오답입니다."
            }

            <br><br>

            정답: ${correctAnswer}

        </div>


        <div class="explanation">

            <strong>해설</strong>

            <br><br>

            ${q.explanation || "해설이 없습니다."}

        </div>

    `;

}


// ========================================
// 문제 목록으로 돌아가기
// ========================================

function goBackToList() {

    if (!window.currentQuestion) {

        showHome("past");

        return;

    }


    const q =
        window.currentQuestion;


    if (q.section === "이론") {

        showTheoryUnits(
            q.subject
        );

    }

    else {

        showQuestions(

            q.subject,

            q.examType,

            q.year

        );

    }

}


// ========================================
// HTML 속 문자열에 작은따옴표가 들어가는 경우 방지
// ========================================

function escapeQuotes(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


// ========================================
// 시작
// ========================================

loadQuestions();
