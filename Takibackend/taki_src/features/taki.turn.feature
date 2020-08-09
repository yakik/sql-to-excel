Feature: taki turn

Scenario: end of taki change direction card
    Given a game with players:
    |player1|player2|player3|
    And it is "player1" turn, direction is "LEFT_TO_RIGHT"
    When "player1" places a "RED" "TAKI" card on the table
    Then next player is "player1"
    When "player1" places a "RED" "CHANGE_DIRECTION" card on the table
    Then next player is "player1"
    When "player1" indicates Taki series is done
    Then next player is "player3"

  Scenario: end of taki stop card
    Given a game with players:
    |player1|player2|player3|player4|
    And it is "player1" turn, direction is "RIGHT_TO_LEFT"
    When "player1" places a "RED" "TAKI" card on the table
    Then next player is "player1"
    When "player1" places a "RED" "STOP" card on the table
    Then next player is "player1"
    When "player1" indicates Taki series is done
    Then next player is "player3"

  Scenario: end of king taki change direction card
    Given a game with players:
    |player1|player2|player3|
    And it is "player1" turn, direction is "LEFT_TO_RIGHT"
    When "player1" places a King "RED" "TAKI" card on the table
    Then next player is "player1"
    When "player1" places a King "RED" "CHANGE_DIRECTION" card on the table
    Then next player is "player1"
    When "player1" indicates Taki series is done
    Then next player is "player3"

  Scenario: end of king taki stop card
    Given a game with players:
    |player1|player2|player3|player4|
    And it is "player1" turn, direction is "RIGHT_TO_LEFT"
    When "player1" places a "RED" "TAKI" card on the table
    Then next player is "player1"
    When "player1" places a King "RED" "STOP" card on the table
    Then next player is "player1"
    When "player1" indicates Taki series is done
    Then next player is "player3"


 