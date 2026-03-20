
document.addEventListener("DOMContentLoaded", () => {
    
    // get saved list
    const saved = localStorage.getItem("myCourses");
    const courseList = saved ? JSON.parse(saved) : [];

    const form = document.getElementById('addCourseForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 

            // Create course object from form
            const formData = new FormData(this);
            const courseObject = Object.fromEntries(formData.entries());
            
            // Call the add function
            addCourse(courseObject);
            
            this.reset();
        });
    }

    function addCourse(course) {
        courseList.push(course);
        saveAndRender();
    }

    function editCourse(course) {
        //function logic
        courseList.push(course);
        saveAndRender();
    }

    function deleteCourse(course) {
        //function logic
        courseList.push(course);
        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem("myCourses", JSON.stringify(courseList));
        console.log("Current List:", courseList);
        display(); 
    }

    function display() {
        //function logic
    }


    function highlightConflicts() 
        {const sortedCourses = courseList.toSorted((a, b) => a.startTime.localeCompare(b.startTime));
        const conflicts = [];
        for (let i = 1; i < sortedCourses.length; i++) {
            const current = sortedCourses[i];
            const previous = sortedCourses[i - 1];
            // check if this course starts before the previous one ends
            if ((current.day == previous.day) && (current.startTime < previous.endTime)) {
                conflicts.push(current, previous);
            }
        }
        conflicts.forEach((course) => {
            course.classList.append("conflicting");
        })
    }
    
});