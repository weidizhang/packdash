def remove_duplicates(arr):
    seen = set()
    i = 0

    while i < len(arr):
        if arr[i] not in seen:
            seen.add(arr[i])
            i += 1
        else:
            del arr[i]
