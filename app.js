// ========================================
// 나의 문제집
// app.js
// ========================================


// ========================================
// 문제 데이터
// ========================================

let questions = [];


// ========================================
// 오답 데이터
// ========================================

let wrongAnswers =
    JSON.parse(
        localStorage.getItem("wrongAnswers")
    ) || [];


// 현재 문제
window.currentQuestion = null;


// 현재 문제 목록
window.currentQuestionList = [];


// 현재 문제의 위치
window.currentQuestionIndex = 0;


// ========================================
// questions.json 불러오기
// ========================================

async function loadQuestions() {

    try {

        const response =
            await fetch("questions.json");

        if (!response.ok) {

            throw new Error(
                "questions.json을 불러오지 못했습니다."
            );

        }

        questions = await response.json();

        showHome("past");

    }

    catch (error) {

        console.error(error);

        alert(
            "문제 데이터를 불러오지 못했습니다.\n" +
            "questions.json 파일을 확인해주세요."
        );

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

    if (type === "theory") {

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

    const subjects = [...new Set(

        questions
            .filter(q =>
                q.section === "기출"
            )
            .map(q =>
                q.subject
            )

    )];


    let html = "";


    subjects.forEach(subject => {

        html += `

        <button
            class="menu-button"
            onclick="showExamTypes('${subject}')">

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

    const examTypes = [...new Set(

        questions

            .filter(q =>
                q.section === "기출" &&
                q.subject === subject
            )

            .map(q =>
                q.examType
            )

            .filter(type =>
                type !== "" &&
                type != null
            )

    )];


    let html = `

        <button
            class="back-button"
            onclick="showPastSubjects()">

            ← 과목

        </button>

        <h2>${subject}</h2>

    `;


    examTypes.forEach(examType => {

        html += `

        <button
            class="menu-button"
            onclick="showYears(
                '${subject}',
                '${examType}'
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

    const years = [...new Set(

        questions

            .filter(q =>
                q.section === "기출" &&
                q.subject === subject &&
                q.examType === examType
            )

            .map(q =>
                q.year
            )

            .filter(year =>
                year !== "" &&
                year != null
            )

    )];


    let html = `

        <button
            class="back-button"
            onclick="showExamTypes('${subject}')">

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
            onclick="showQuestions(
                '${subject}',
                '${examType}',
                '${year}'
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

        q.year === year

    );


    let html = `

        <button
            class="back-button"
            onclick="showYears(
                '${subject}',
                '${examType}'
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
            onclick="openQuestion(${q.id})">

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

    const subjects = [...new Set(

        questions

            .filter(q =>
                q.section === "이론"
            )

            .map(q =>
                q.subject
            )

    )];


    let html = "";


    subjects.forEach(subject => {

        html += `

        <button
            class="menu-button"
            onclick="showTheoryUnits('${subject}')">

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

    const units = [...new Set(

        questions

            .filter(q =>
                q.section === "이론" &&
                q.subject === subject
            )

            .map(q =>
                q.unit
            )

            .filter(unit =>
                unit !== "" &&
                unit != null
            )

    )];


    let html = `

        <button
            class="back-button"
            onclick="showTheorySubjects()">

            ← 과목

        </button>

        <h2>${subject}</h2>

    `;


    units.forEach(unit => {

        html += `

        <button
            class="menu-button"
            onclick="showTheoryQuestions(
                '${subject}',
                '${unit}'
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
            onclick="showTheoryUnits('${subject}')">

            ← 단원

        </button>

        <h2>${unit}</h2>

    `;


    list.forEach(q => {

        html += `

        <button
            class="menu-button"
            onclick="openQuestion(${q.id})">

            ${q.number}

        </button>

        `;

    });


    document
        .getElementById("theoryContent")
        .innerHTML = html;

}


// ========================================
// 문제 열기
// ========================================

function openQuestion(id) {

    const q =
        questions.find(
            question =>
                question.id === id
        );


    if (!q) return;


    window.currentQuestion = q;


    // ----------------------------------------
    // 기출 문제 목록
    // ----------------------------------------

    if (q.section === "기출") {

        window.currentQuestionList =
            questions.filter(item =>

                item.section === "기출" &&
                item.subject === q.subject &&
                item.examType === q.examType &&
                item.year === q.year

            );

    }

    // ----------------------------------------
    // 이론 문제 목록
    // ----------------------------------------

    else {

        window.currentQuestionList =
            questions.filter(item =>

                item.section === "이론" &&
                item.subject === q.subject &&
                item.unit === q.unit

            );

    }


    window.currentQuestionIndex =
        window.currentQuestionList.findIndex(
            item =>
                item.id === q.id
        );


    renderQuestion(q);

}


// ========================================
// 문제 화면
// ========================================

function renderQuestion(q) {

    let html = `

        <button
            class="back-button"
            onclick="goBackToList()">

            ← 문제 목록

        </button>


        <div class="card">

            <div class="question-number">
                ${q.number}
            </div>

            <div class="question-text">
                ${q.question}
            </div>

    `;


    // ====================================
    // 주관식
    // ====================================

    if (
        q.type === "주관식" ||
        q.type === "short"
    ) {

        html += `

            <input
                type="text"
                id="subjectiveAnswer"
                class="subjective-answer"
                placeholder="답을 입력하세요">

            <button
                class="submit-button"
                onclick="answerSubjectiveQuestion(${q.id})">

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


        (q.choices || []).forEach(
            (choice, index) => {

                html += `

                    <button
                        class="choice"
                        id="choice-${index}"
                        onclick="answerQuestion(
                            ${q.id},
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


    // ====================================
    // 이전 / 다음
    // ====================================

    html += createNavigationButtons();


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
// 이전 / 다음 버튼
// ========================================

function createNavigationButtons() {

    const list =
        window.currentQuestionList || [];

    const index =
        window.currentQuestionIndex;


    let html = `

        <div style="
            display:flex;
            gap:10px;
            margin-top:20px;
        ">

    `;


    if (index > 0) {

        html += `

            <button
                class="menu-button"
                style="margin-bottom:0;"
                onclick="goToPreviousQuestion()">

                ← 이전 문제

            </button>

        `;

    }


    if (index < list.length - 1) {

        html += `

            <button
                class="menu-button"
                style="margin-bottom:0;"
                onclick="goToNextQuestion()">

                다음 문제 →

            </button>

        `;

    }


    html += `

        </div>

    `;


    return html;

}


// ========================================
// 이전 문제
// ========================================

function goToPreviousQuestion() {

    if (
        window.currentQuestionIndex <= 0
    ) {

        return;

    }


    window.currentQuestionIndex--;


    const q =
        window.currentQuestionList[
            window.currentQuestionIndex
        ];


    window.currentQuestion = q;


    renderQuestion(q);

}


// ========================================
// 다음 문제
// ========================================

function goToNextQuestion() {

    if (
        window.currentQuestionIndex >=
        window.currentQuestionList.length - 1
    ) {

        return;

    }


    window.currentQuestionIndex++;


    const q =
        window.currentQuestionList[
            window.currentQuestionIndex
        ];


    window.currentQuestion = q;


    renderQuestion(q);

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
                question.id === id
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


    const correct =
        document.getElementById(
            "choice-" +
            q.answer
        );


    if (
        selectedIndex === q.answer
    ) {

        selected
            .classList
            .add("correct");

    }

    else {

        selected
            .classList
            .add("wrong");

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

            정답: ${q.answer + 1}번

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
                question.id === id
        );


    if (!q) return;


    const input =
        document.getElementById(
            "subjectiveAnswer"
        );


    const userAnswer =
        input.value.trim();


    if (userAnswer === "") {

        alert("답을 입력해주세요.");

        return;

    }


    input.disabled = true;


    const correctAnswer =
        String(
            q.answerText ??
            q.answer ??
            ""
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


    document
        .querySelector(".submit-button")
        .disabled = true;


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
            x => x.id === q.id
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

    showWrongMain();

}


// ========================================
// 오답 메인
// ========================================
//
// 오답
// ├─ 기출
// └─ 이론
//
// ========================================

function showWrongMain() {

    let html = `

        <h2>오답</h2>


        <button
            class="menu-button"
            onclick="showWrongPastSubjects()">

            📝 기출

        </button>


        <button
            class="menu-button"
            onclick="showWrongTheorySubjects()">

            📚 이론

        </button>

    `;


    document
        .getElementById("wrongContent")
        .innerHTML = html;

}


// ========================================
// 오답 기출
// 과목
// ========================================
//
// 오답
// → 기출
// → 재배학개론
// → 국가직 / 지방직
// → 연도
//
// ========================================

function showWrongPastSubjects() {

    const subjects = [...new Set(

        wrongAnswers

            .filter(q =>
                q.section === "기출"
            )

            .map(q =>
                q.subject
            )

    )];


    let html = `

        <button
            class="back-button"
            onclick="showWrongMain()">

            ← 오답

        </button>

        <h2>기출</h2>

    `;


    if (subjects.length === 0) {

        html += `

            <div class="empty">

                아직 기출 오답이 없습니다.

            </div>

        `;

    }


    subjects.forEach(subject => {

        html += `

            <button
                class="menu-button"
                onclick="showWrongPastTypes(
                    '${subject}'
                )">

                📖 ${subject}

            </button>

        `;

    });


    document
        .getElementById("wrongContent")
        .innerHTML = html;

}


// ========================================
// 오답 기출
// 국가직 / 지방직
// ========================================

function showWrongPastTypes(subject) {

    const examTypes = [...new Set(

        wrongAnswers

            .filter(q =>
                q.section === "기출" &&
                q.subject === subject
            )

            .map(q =>
                q.examType
            )

            .filter(type =>
                type !== "" &&
                type != null
            )

    )];


    let html = `

        <button
            class="back-button"
            onclick="showWrongPastSubjects()">

            ← 기출

        </button>

        <h2>${subject}</h2>

    `;


    examTypes.forEach(examType => {

        html += `

            <button
                class="menu-button"
                onclick="showWrongPastYears(
                    '${subject}',
                    '${examType}'
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
// 오답 기출
// 연도
// ========================================

function showWrongPastYears(
    subject,
    examType
) {

    const years = [...new Set(

        wrongAnswers

            .filter(q =>
                q.section === "기출" &&
                q.subject === subject &&
                q.examType === examType
            )

            .map(q =>
                q.year
            )

            .filter(year =>
                year !== "" &&
                year != null
            )

    )];


    let html = `

        <button
            class="back-button"
            onclick="showWrongPastTypes(
                '${subject}'
            )">

            ← ${subject}

        </button>

        <h2>
            ${subject} · ${examType}
        </h2>

    `;


    years.forEach(year => {

        html += `

            <button
                class="menu-button"
                onclick="showWrongPastQuestions(
                    '${subject}',
                    '${examType}',
                    '${year}'
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
// 오답 기출
// 문제 목록
// ========================================

function showWrongPastQuestions(
    subject,
    examType,
    year
) {

    const list = wrongAnswers.filter(q =>

        q.section === "기출" &&

        q.subject === subject &&

        q.examType === examType &&

        q.year === year

    );


    let html = `

        <button
            class="back-button"
            onclick="showWrongPastYears(
                '${subject}',
                '${examType}'
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
                onclick="openWrongQuestion(
                    ${q.id}
                )">

                ${q.number}

            </button>

        `;

    });


    document
        .getElementById("wrongContent")
        .innerHTML = html;

}


// ========================================
// 오답 이론
// 과목
// ========================================
//
// 오답
// → 이론
// → 재배학개론
// → 벼 기초
// → 문제
//
// ========================================

function showWrongTheorySubjects() {

    const subjects = [...new Set(

        wrongAnswers

            .filter(q =>
                q.section === "이론"
            )

            .map(q =>
                q.subject
            )

    )];


    let html = `

        <button
            class="back-button"
            onclick="showWrongMain()">

            ← 오답

        </button>

        <h2>이론</h2>

    `;


    if (subjects.length === 0) {

        html += `

            <div class="empty">

                아직 이론 오답이 없습니다.

            </div>

        `;

    }


    subjects.forEach(subject => {

        html += `

            <button
                class="menu-button"
                onclick="showWrongTheoryUnits(
                    '${subject}'
                )">

                📖 ${subject}

            </button>

        `;

    });


    document
        .getElementById("wrongContent")
        .innerHTML = html;

}


// ========================================
// 오답 이론
// 단원
// ========================================

function showWrongTheoryUnits(subject) {

    const units = [...new Set(

        wrongAnswers

            .filter(q =>
                q.section === "이론" &&
                q.subject === subject
            )

            .map(q =>
                q.unit
            )

            .filter(unit =>
                unit !== "" &&
                unit != null
            )

    )];


    let html = `

        <button
            class="back-button"
            onclick="showWrongTheorySubjects()">

            ← 이론

        </button>

        <h2>${subject}</h2>

    `;


    units.forEach(unit => {

        html += `

            <button
                class="menu-button"
                onclick="showWrongTheoryQuestions(
                    '${subject}',
                    '${unit}'
                )">

                📂 ${unit}

            </button>

        `;

    });


    document
        .getElementById("wrongContent")
        .innerHTML = html;

}


// ========================================
// 오답 이론
// 문제 목록
// ========================================

function showWrongTheoryQuestions(
    subject,
    unit
) {

    const list = wrongAnswers.filter(q =>

        q.section === "이론" &&

        q.subject === subject &&

        q.unit === unit

    );


    let html = `

        <button
            class="back-button"
            onclick="showWrongTheoryUnits(
                '${subject}'
            )">

            ← 단원

        </button>

        <h2>${unit}</h2>

    `;


    list.forEach(q => {

        html += `

            <button
                class="menu-button"
                onclick="openWrongQuestion(
                    ${q.id}
                )">

                ${q.number}

        </button>

        `;

    });


    document
        .getElementById("wrongContent")
        .innerHTML = html;

}


// ========================================
// 오답 문제 열기
// ========================================

function openWrongQuestion(id) {

    const q =
        wrongAnswers.find(
            question =>
                question.id === id
        );


    if (!q) return;


    // ----------------------------------------
    // 오답 기출 목록
    // ----------------------------------------

    if (q.section === "기출") {

        window.currentQuestionList =
            wrongAnswers.filter(item =>

                item.section === "기출" &&
                item.subject === q.subject &&
                item.examType === q.examType &&
                item.year === q.year

            );

    }

    // ----------------------------------------
    // 오답 이론 목록
    // ----------------------------------------

    else {

        window.currentQuestionList =
            wrongAnswers.filter(item =>

                item.section === "이론" &&
                item.subject === q.subject &&
                item.unit === q.unit

            );

    }


    window.currentQuestionIndex =
        window.currentQuestionList.findIndex(
            item =>
                item.id === q.id
        );


    window.currentQuestion = q;


    renderWrongQuestion(q);

}


// ========================================
// 오답 문제 화면
// ========================================

function renderWrongQuestion(q) {

    let html = `

        <button
            class="back-button"
            onclick="goBackToWrongList()">

            ← 문제 목록

        </button>


        <div class="card">

            <div class="question-number">
                ${q.number}
            </div>

            <div class="question-text">
                ${q.question}
            </div>

    `;


    // ====================================
    // 주관식
    // ====================================

    if (
        q.type === "주관식" ||
        q.type === "short"
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
                    ${q.id}
                )">

                정답 확인

            </button>

            <div id="wrongFeedback"></div>

        `;

    }

    // ====================================
    // 객관식
    // ====================================

    else {

        html += `

            <div id="wrongChoices">

        `;


        (q.choices || []).forEach(
            (choice, index) => {

                html += `

                    <button
                        class="choice"
                        id="wrong-choice-${index}"
                        onclick="answerWrongQuestion(
                            ${q.id},
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


    html += createWrongNavigationButtons();


    html += `

        </div>

    `;


    document
        .getElementById("wrongContent")
        .innerHTML = html;

}


// ========================================
// 오답 이전 / 다음 버튼
// ========================================

function createWrongNavigationButtons() {

    const list =
        window.currentQuestionList || [];

    const index =
        window.currentQuestionIndex;


    let html = `

        <div style="
            display:flex;
            gap:10px;
            margin-top:20px;
        ">

    `;


    if (index > 0) {

        html += `

            <button
                class="menu-button"
                style="margin-bottom:0;"
                onclick="goToPreviousWrongQuestion()">

                ← 이전 오답

            </button>

        `;

    }


    if (index < list.length - 1) {

        html += `

            <button
                class="menu-button"
                style="margin-bottom:0;"
                onclick="goToNextWrongQuestion()">

                다음 오답 →

            </button>

        `;

    }


    html += `

        </div>

    `;


    return html;

}


// ========================================
// 이전 오답
// ========================================

function goToPreviousWrongQuestion() {

    if (
        window.currentQuestionIndex <= 0
    ) {

        return;

    }


    window.currentQuestionIndex--;


    const q =
        window.currentQuestionList[
            window.currentQuestionIndex
        ];


    window.currentQuestion = q;


    renderWrongQuestion(q);

}


// ========================================
// 다음 오답
// ========================================

function goToNextWrongQuestion() {

    if (
        window.currentQuestionIndex >=
        window.currentQuestionList.length - 1
    ) {

        return;

    }


    window.currentQuestionIndex++;


    const q =
        window.currentQuestionList[
            window.currentQuestionIndex
        ];


    window.currentQuestion = q;


    renderWrongQuestion(q);

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
                question.id === id
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


    const correct =
        document.getElementById(
            "wrong-choice-" +
            q.answer
        );


    if (
        selectedIndex === q.answer
    ) {

        selected
            .classList
            .add("correct");

    }

    else {

        selected
            .classList
            .add("wrong");

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

            정답: ${q.answer + 1}번

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
                question.id === id
        );


    if (!q) return;


    const input =
        document.getElementById(
            "wrongSubjectiveAnswer"
        );


    const userAnswer =
        input.value.trim();


    if (userAnswer === "") {

        alert("답을 입력해주세요.");

        return;

    }


    input.disabled = true;


    const correctAnswer =
        String(
            q.answerText ??
            q.answer ??
            ""
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


    document
        .querySelector(".submit-button")
        .disabled = true;


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

    if (!window.currentQuestion) return;


    const q =
        window.currentQuestion;


    if (q.section === "이론") {

        showTheoryQuestions(
            q.subject,
            q.unit
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
// 오답 목록으로 돌아가기
// ========================================

function goBackToWrongList() {

    if (!window.currentQuestion) return;


    const q =
        window.currentQuestion;


    if (q.section === "이론") {

        showWrongTheoryQuestions(
            q.subject,
            q.unit
        );

    }

    else {

        showWrongPastQuestions(
            q.subject,
            q.examType,
            q.year
        );

    }

}


// ========================================
// 처음 실행
// ========================================

loadQuestions();
