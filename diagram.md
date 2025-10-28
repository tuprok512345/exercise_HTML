graph TD;
    A[UI Layer (React Components)] -- "Gửi câu trả lời" --> B[Service Layer (mockTestService)];
    A -- "Yêu cầu & hiển thị dữ liệu" --> C[Repo Layer (mockTestRepo)];
    B[Service Layer (mockTestService)] -- "Lấy đáp án để chấm điểm" --> C[Repo Layer (mockTestRepo)];

    subgraph UI Layer
        direction TB
        App(App)
        ReadingSection(ReadingSection)
        WritingSection(WritingSection)
        ListeningSection(ListeningSection)
    end

    subgraph Service Layer
        direction TB
        calculateReadingScore("calculateReadingScore(userAnswers)")
        calculateListeningScore("calculateListeningScore(userAnswers)")
    end

    subgraph Repo Layer
        direction TB
        getReadingData("getReadingData()")
        getListeningData("getListeningData()")
        getTimes("getTimes()")
    end