from .schemas import PlannerItem, PlannerRequest, PlannerResponse


def distribute_minutes(request: PlannerRequest) -> PlannerResponse:
    subjects = request.subjects
    total_weight = sum(subject.difficulty for subject in subjects)

    raw_allocations = [
        request.available_minutes * subject.difficulty / total_weight
        for subject in subjects
    ]

    allocations = [int(value) for value in raw_allocations]
    remaining = request.available_minutes - sum(allocations)

    fractional_order = sorted(
        range(len(subjects)),
        key=lambda index: raw_allocations[index] - allocations[index],
        reverse=True,
    )

    for index in fractional_order[:remaining]:
        allocations[index] += 1

    plan = [
        PlannerItem(
            subject_id=subject.subject_id,
            name=subject.name,
            difficulty=subject.difficulty,
            allocated_minutes=allocations[index],
        )
        for index, subject in enumerate(subjects)
    ]

    return PlannerResponse(
        total_minutes=request.available_minutes,
        plan=plan,
        message=(
            "Flora gave more time to subjects that feel harder. "
            "Adjust the plan if your energy or deadlines require it."
        ),
    )
