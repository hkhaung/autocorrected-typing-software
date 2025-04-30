def accuracy(typed, reference):
    """Compares each word from a list of typed words to each word from reference list of words.
    Then, calculates the accuracy of correctly typed words
    Args:
        typed (List[str]): list of words
        reference (List[str]): list of words
    Returns:
        (float): the accuracy in percentage
    """
    typed_words = typed.split()
    reference_words = reference.split()
    num_typed_words, num_ref_words, count = len(typed_words), len(reference_words), 0
    if num_typed_words == 0 and num_ref_words > 0:
        return 0.0

    for i in range(min(num_typed_words, num_ref_words)):
        if typed_words[i] == reference_words[i]:
            correct_typed += 1

    return correct_typed / num_typed_words * 100


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
    return (num_chars / 5) / mins
    