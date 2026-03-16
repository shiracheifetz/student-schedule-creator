
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

    
});