
document.addEventListener("DOMContentLoaded", () => {
    
    // get saved list
    const saved = localStorage.getItem("myCourses");
    let courseList = saved ? JSON.parse(saved) : [];
    console.log("saved: ",saved);
    console.log("current: ",courseList);

    //providing the initial course dropdown
        const dropdowns = document.getElementsByClassName('courseDropdown');
        Array.from(dropdowns).forEach(dropdown => {
        courseList.forEach(course => {
            let opt = new Option(course.coursename, course.coursename);
            dropdown.add(opt);
        });
        });

    //providing the initial edit course details dropdown
        let detailList=['Course Name','Teacher','Day','Start Time','End Time'];
        const courseDetailDropdown = document.getElementById('courseDetailDropdown');
        detailList.forEach(detail => {
        let opt = new Option(detail,detail);
        courseDetailDropdown.add(opt);
    });  

    

    const form = document.getElementById('courseForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 

            // Create course object from form
            const formData = new FormData(this);
            const courseObject = Object.fromEntries(formData.entries());
            
            // Identify which button was clicked
            const clickedButton = e.submitter.id;

            // Call the specific function based on the button ID
            if (clickedButton === 'addBtn') {
                addCourse(courseObject);
            } else if (clickedButton === 'editBtn') {
                editCourse(courseObject);
            } else if (clickedButton === 'deleteBtn') {
                deleteCourse(courseObject);
            }

            this.reset();
            }); 

            
        };
    

    function addCourse(course) {
        courseList.push(course);
        saveAndRender();
        console.log("added a course")
    }

    function editCourse(course) {        
        // Gets the relevent values 
        const editCourseDropdown = document.querySelectorAll('.courseDropdown')[1]; 
        const selectedCourseName = editCourseDropdown.value;

        const detailDropdown = document.getElementById('courseDetailDropdown');
        let propName = detailDropdown.value.toLowerCase().replace(/\s+/g, '');

        const editInput = document.getElementById('edit');
        const newValue = editInput.value;

        // updates the list
        for (let c of courseList) {
            if (c.coursename === selectedCourseName) {
                c[propName] = newValue; 
                break; 
            }
        }

        saveAndRender(); 
        console.log("Updated course list:", courseList);
    }
        

    function deleteCourse(course) {
        const dropdown = document.querySelector('.courseDropdown');
        const selectedCourse = dropdown.value;
        //create new course list excluding the course to be deleted
        courseList=courseList.filter(course=>course.coursename!==selectedCourse);
        
        saveAndRender();
        console.log("deleted a course", selectedCourse,"!")
    }


    function saveAndRender() {
        localStorage.setItem("myCourses", JSON.stringify(courseList));
        console.log("Current List:", courseList);
        display(); 
    }


    function display() {

    //providing the updated course dropdown
        const detailDropdown = document.getElementById('courseDetailDropdown');
        detailDropdown.options.length = 0; 
        const courseDropdowns = document.getElementsByClassName('courseDropdown');
        Array.from(courseDropdowns).forEach(dropdown => {
        dropdown.options.length = 0; 
        // Repopulate with the current course list
        courseList.forEach(course => {
            let opt = new Option(course.coursename, course.coursename);
            dropdown.add(opt);
        });
        });

    //providing the updated edit course details dropdown
        let detailList=['Course Name','Teacher','Day','Start Time','End Time'];
        const courseDetailDropdown = document.getElementById('courseDetailDropdown');
        detailList.forEach(detail => {
        let opt = new Option(detail,detail);
        courseDetailDropdown.add(opt);
        });
    
    
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