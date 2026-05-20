package aml.code.screeningservice.dto.response;

import lombok.Data;

@Data
public class ReviewResponse {

    private long totalTransactions;    // всего транзакций
    private long pendingReview;        // ожидают решения (UNDER_REVIEW)
    private long blockedToday;         // заблокировано сегодня (BLOCKED_AUTO)
    private long totalHits;            // всего совпадений найдено
    private long totalClear;           // всего проверок прошло чисто
    private double hitRate;
}
