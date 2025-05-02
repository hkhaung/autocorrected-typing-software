def accuracy(typed, reference_words):
    """Compares each word from a list of typed words to each word from reference list of words.
    Then, calculates the accuracy of correctly typed words
    Args:
        typed (List[str]): list of words
        reference_words (List[str]): list of words
    Returns:
        (float): the accuracy in percentage
    """
    if not reference_words:
        return 0.0

    typed_words = typed.split()
    num_typed_words, num_ref_words, count = len(typed_words), 2 * len(reference_words) - 1, 0
    if num_typed_words == 0 and num_ref_words > 0:
        return 0.0

    for i in range(min(num_typed_words, num_ref_words)):
        if typed_words[i] == reference_words[i]:
            count += 1

    return round(count / num_typed_words * 100, 2)


def wpm(typed, elapsed):
    """formula: (Total Characters Typed / 5) / Time in Minutes
    Args:
        typed (str): the word
        elapsed (float): the time elapsed in secs
    Returns:
        (float): wpm of the typed string
    """
    if (elapsed == 0):
        return
    
    num_chars = len(typed)
    mins = elapsed / 60
    return round((num_chars / 5) / mins, 2)
    