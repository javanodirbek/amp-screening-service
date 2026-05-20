package aml.code.screeningservice.entity.enums;

public enum TransactionStatus {
    PENDING("транзакция создана, ожидает проверки"),
    CHECKING("система начала автоматическую проверку"),
    CLEAR("проверка пройдена, совпадений нет, транзакция разрешена"),
    BLOCKED_AUTO("система нашла совпадение, заблокирована автоматически"),
    UNDER_REVIEW("передана compliance-офицеру для ручного решения"),
    APPROVED("офицер одобрил (разрешил транзакцию)"),
    REJECTED("офицер отклонил (транзакция запрещена)");

    String info;

    TransactionStatus(String info) {
        this.info = info;
    }
}
