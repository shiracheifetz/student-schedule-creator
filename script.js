
document.addEventListener("DOMContentLoaded", () => {
    
    // get saved list
    const saved = localStorage.getItem("myCourses");
    let courseList = saved ? JSON.parse(saved) : [];
    console.log("saved: ",saved);
    console.log("current: ",courseList);

    //providing the initial course dropdown
        if (courseList.length!==0){
            const dropdowns = document.getElementsByClassName('courseDropdown');
            Array.from(dropdowns).forEach(dropdown => {
            courseList.forEach(course => {
                let opt = new Option(course.coursename, course.coursename);
                dropdown.add(opt);
                console.log("set up initial course dropdown")
            });
            });
        }
        //create placeholder if there are no courses
        else{
            const dropdowns = document.getElementsByClassName('courseDropdown');
            Array.from(dropdowns).forEach(dropdown => {
            const placeholder = document.createElement('option');
            placeholder.text = "Not currently enrolled in any courses";
            dropdown.prepend(placeholder);
            console.log("entered else becuase course list is empty")
            }); 
        }


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
        const courseDropdowns = document.getElementsByClassName('courseDropdown');
        Array.from(courseDropdowns).forEach(dropdown => {
            dropdown.options.length = 0; 
            // Repopulate with the current course list
            courseList.forEach(course => {
                let opt = new Option(course.coursename, course.coursename);
                dropdown.add(opt);
            });
        });

    
    
    
        //function logic
    }

    
});