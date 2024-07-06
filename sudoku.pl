% square_at(Puzzle, I, J, Value) :- 
%     nth1(I, Puzzle, Row), 
%     nth1(J, Row, Value).

% filled_square_at(Puzzle, I, J, Value) :-
%     square_at(Puzzle, I, J, Value1),
%     nonvar(Value1),
%     Value is Value1.

% empty_square_at(Puzzle, I, J) :-
%     square_at(Puzzle, I, J, Value),
%     var(Value).

% square_map(I, J, Value, I-J-Value).

square_at(Puzzle, I-J, Value) :- 
    nth1(I, Puzzle, Row), 
    nth1(J, Row, Value).

filled_square_at(Puzzle, I-J, Value) :-
    square_at(Puzzle, I-J, Value1),
    nonvar(Value1),
    Value is Value1.

empty_square_at(Puzzle, I-J) :-
    square_at(Puzzle, I-J, Value),
    var(Value).


% empty_square_mapping(Puzzle, Squares) :- 
%     length(Puzzle, Size),
%     Max is Size+1,
%     empty_square_mapping(Puzzle, Squares, [], Max, 1, 1).
% empty_square_mapping(_, Squares, Squares, Max, Max, _).
% empty_square_mapping(Puzzle, Squares, Acc, Max, I, Max) :- 
%     I1 is I+1,
%     empty_square_mapping(Puzzle, Squares, Acc, Max, I1, 1).
% empty_square_mapping(Puzzle, Squares, Acc, Max, I, J) :-
%     square_at(Puzzle, I, J, Value),
%     var(Value),
%     square_map(I, J, Value, NewMapping),
%     append(Acc, [NewMapping], Acc1),
%     J1 is J+1,
%     empty_square_mapping(Puzzle, Squares, Acc1, Max, I, J1).
% empty_square_mapping(Puzzle, Squares, Acc, Max, I, J) :- 
%     I1 is I+1,
%     J1 is J+1,
%     empty_square_mapping(Puzzle, Squares, Acc, Max, I1, J1).

filled_values_in_row(Puzzle, I, Values) :-
    findall(Value, filled_square_at(Puzzle, I-_, Value), Values).

filled_values_in_column(Puzzle, J, Values) :-
    findall(Value, filled_square_at(Puzzle, _-J, Value), Values).

empty_coords(Puzzle, EmptiesCoords) :- findall(Coords, empty_square_at(Puzzle, Coords), EmptiesCoords).


possible_value(Puzzle, I-J, Value) :-
    length(Puzzle, Size),
    between(1, Size, Value),
    filled_values_in_row(Puzzle, I, RowValues),
    \+memberchk(Value, RowValues),
    filled_values_in_column(Puzzle, J, ColumnValues),
    \+memberchk(Value, ColumnValues).

possible_values(Puzzle, Coords, Values) :-
    length(Puzzle, Size),
    bagof(Number, between(1, Size, Number), Numbers),
    possible_values(Puzzle, Coords, Values, [], Numbers).
possible_values(_, _, Values, Values, []).
possible_values(Puzzle, I-J, Values, Acc, [Num | Numbers]) :-
    filled_values_in_row(Puzzle, I, RowValues),
    \+memberchk(Num, RowValues),
    filled_values_in_column(Puzzle, J, ColumnValues),
    \+memberchk(Num, ColumnValues),
    possible_values(Puzzle, I-J, Values, [Num | Acc], Numbers),
    !.
possible_values(Puzzle, I-J, Values, Acc, [_ | Numbers]) :-
    possible_values(Puzzle, I-J, Values, Acc, Numbers).


% solve(Puzzle) :- empty_square_mapping(Puzzle, Empties).
% % sort empties by number of possible values
% % assign head as one of its possible values
% % after each assignment, re-sort

solve(Puzzle) :-
    empty_coords(Puzzle, Empties),
    solve(Puzzle, Empties).
solve(Puzzle, []).
solve(Puzzle, [Empty | Empties]) :-
    possible_value(Puzzle, Empty, PossibleValue),
    square_at(Puzzle, Empty, PossibleValue),
    solve(Puzzle, Empties).

puzzle(1, [[_, _, 6, 1, _, 2, 4, _, _], 
[4, _, _, 5, _, _, _, _, 6], 
[9, 1, _, 7, _, _, _, 8, 3], 
[2, _, _, 9, _, 5, _, 7, _], 
[_, _, _, _, _, _, _, _, 1], 
[_, _, _, _, 8, _, 2, 4, _], 
[6, 2, 9, 8, 7, _, 3, _, _], 
[_, _, 8, 3, _, _, _, _, _], 
[_, 7, _, 2, _, _, _, _, _]]).

puzzle(2, [
    [1, _, _],
    [3, 2, _],
    [_, _, 3]
]).