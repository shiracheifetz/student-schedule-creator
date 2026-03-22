document.addEventListener("DOMContentLoaded", () => {
    const detailList = ["Course Name", "Teacher", "Day", "Start Time", "End Time"];

    // get saved list
    const saved = localStorage.getItem("myCourses");
    let courseList = saved ? JSON.parse(saved).map(normalizeCourse) : [];
    console.log("saved: ",saved);
    console.log("current: ",courseList);

    //providing the initial course dropdown
        if (courseList.length > 0){
            setTimeout(() => {
                highlightConflicts();
            }, 0);
            display();
        }
        //create placeholder if there are no courses
        else{
            const dropdowns = document.getElementsByClassName('courseDropdown');
            Array.from(dropdowns).forEach(dropdown => {
            const placeholder = document.createElement('option');
            placeholder.text = "Not currently enrolled in any courses";
            dropdown.prepend(placeholder);
            console.log("entered else because course list is empty")
            }); 
        }


    const form = document.getElementById('courseForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 

            const formData = new FormData(this);
            const courseObject = buildCourseFromForm(formData);
            
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
        editInput.value = '';
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
        highlightConflicts();
    }


    function display() {
        clearCalendar();

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

        //course details dropdown
        const courseDetailDropdown = document.getElementById('courseDetailDropdown');
        detailList.forEach(detail => {
            let opt = new Option(detail,detail);
            courseDetailDropdown.add(opt);
        });

        courseList.forEach(course => {
            normalizeDays(course.day).forEach(day => {
                //day matches the data-day attribute in the calendar
                const dayElement = document.querySelector(`.day[data-day="${day}"]`);
                
                if (dayElement) {
                    //course card for the schedule display
                    const courseCard = document.createElement('div');
                    courseCard.className = 'course-card';
                    courseCard.setAttribute('data-name', course.coursename.trim());
                    courseCard.innerHTML = `
                        <strong>${course.coursename}</strong><br>
                        ${course.teacher}<br>
                        ${formatTime(course.starttime)} - ${formatTime(course.endtime)}
                    `;

                       

                    // assign correct day to the course card    
                    dayElement.appendChild(courseCard);
                }
            });
        });
    }

    function buildCourseFromForm(formData) {
        const courseObject = Object.fromEntries(formData.entries());
        courseObject.day = formData.getAll("day");
        return normalizeCourse(courseObject);
    }

    function normalizeCourse(course) {
        return {
            ...course,
            starttime: course.starttime ?? course.startTime ?? "",
            endtime: course.endtime ?? course.endTime ?? "",
            day: normalizeDays(course.day)
        };
    }

    function normalizeDays(days) {
        if (Array.isArray(days)) {
            return days
                .map(day => String(day).trim().toLowerCase())
                .filter(Boolean);
        }

        if (typeof days === "string") {
            return parseDays(days);
        }

        return [];
    }

    function parseDays(dayString) {
        return dayString
            .split(",")
            .map(day => day.trim().toLowerCase())
            .filter(Boolean);
    }

    function clearCalendar() {
        document.querySelectorAll(".day").forEach(dayElement => {
            dayElement.querySelectorAll(".course-card").forEach(card => card.remove());
        });
    }

    display();

    function formatTime(timeString) {
        if (!timeString) return "";
        
        // split army time into array holding hours and minutes
        let [hours, minutes] = timeString.split(':');
        hours = parseInt(hours);
        
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert 
        hours = hours % 12;
        hours = hours ? hours : 12; // if hour is 0, make it 12
        
        return `${hours}:${minutes} ${ampm}`;
    }

    function highlightConflicts() {
        const cards = document.querySelectorAll('.course-card');
        cards.forEach((card) => {
            card.classList.remove("conflicting");
        });
        const sortedCourses = courseList.toSorted((a, b) => a.starttime.localeCompare(b.starttime));
        const conflicts = [];

        for (let i = 0; i < courseList.length; i++) {
            for (let j = i + 1; j < courseList.length; j++) {
                const courseA = courseList[i];
                const courseB = courseList[j];

                // check days
                const shareDay = courseA.day.some(d => courseB.day.includes(d));
                
                // if days and time overlap
                if (shareDay && ((courseA.starttime < courseB.endtime) && 
                                (courseA.endtime > courseB.starttime))) {
                    conflicts.push(courseA);
                    conflicts.push(courseB);
                }
            }
        }
        conflicts.forEach(course => {
            // find all cards with this course name
            cards.forEach(card => {
                if (card.getAttribute('data-name') === course.coursename.trim()) {
                    card.classList.add('conflicting');
                }
            });
        });
    }

    document.getElementById('courseDetailDropdown').addEventListener('change', function() {
        const editInput = document.getElementById('edit');
        const prop = this.value.toLowerCase().replace(/\s+/g, '');
        
        if (prop === 'starttime' || prop === 'endtime') {
            editInput.type = 'time';
        } else {
            editInput.type = 'text';
        }
    });
    
});