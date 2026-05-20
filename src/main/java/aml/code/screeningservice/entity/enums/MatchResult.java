package aml.code.screeningservice.entity.enums;

public enum MatchResult {
    HIT("софпадение найдено"),
    CLEAR("софпадений нет");

    String about;

    MatchResult(String about) {
        this.about = about;
    }
}
