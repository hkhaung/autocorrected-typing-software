def autocorrect(user_word, valid_words, diff_function, limit):
    """Returns the element of VALID_WORDS that has the smallest difference
    from USER_WORD. Instead returns USER_WORD if that difference is greater
    than LIMIT.
    """
    diff = min(valid_words, key=lambda valid: diff_function(user_word, valid, limit))
    if user_word in valid_words:
        return user_word
    elif diff_function(user_word, diff, limit) > limit:
        return user_word
    else:
        return diff
    
    
def subs(start, goal, limit):
    """A diff function that determines how many letters in START need to be substituted to create GOAL
    and adds the difference in their lengths if the len(start) != len(goal)
    Args:
        start (str): word
        goal (str): word
        limit (int): the num of substitutions allowed
    Returns:
        (int): the num of substitutions needed for START to be GOAL as long as this num doesnt exceed limit
        which if it does will return infinity
    """
    if limit < 0:
        return float('inf')
    elif start == "" or goal == "":
        return abs(len(start) - len(goal))
    elif start[0] == goal[0]:
        return subs(start[1:], goal[1:], limit)
    else:
        return subs(start[1:], goal[1:], limit - 1) + 1


def edit_distance(start, goal, limit):
    """A diff function that computes the edit distance from START to GOAL.
    Args:
        start (str): word
        goal (str): word
        limit (int): num of edits you can do
    Returns:
        (int): min num of edits to get to GOAL
    """
    if limit < 0:
        return float('inf')
    elif start == goal:
        return 0
    elif start == "" or goal == "":
        return abs(len(start) - len(goal))
    elif start[0] == goal[0]:
        return edit_distance(start[1:], goal[1:], limit)
    else:
        add_diff = edit_distance(start, goal[1:], limit - 1)
        remove_diff = edit_distance(start[1:], goal, limit - 1)
        substitute_diff = edit_distance(start[1:], goal[1:], limit - 1)
        return min(add_diff, remove_diff, substitute_diff) + 1


def diff(start, goal, limit):
    """A diff function that selects the best approach based on 
    edits_distance and subs functions
    Args:
        start (str): word
        goal (str): word
        limit (int): num of edits you can do
    Returns:
        (int): min num of edits to get to GOAL
    """
    subs_diff = subs(start, goal, limit)
    if subs_diff <= limit:
        return subs_diff  # Fast path: use subs if within limit

    # Otherwise, fall back to the more expensive edit_distance
    return edit_distance(start, goal, limit)
