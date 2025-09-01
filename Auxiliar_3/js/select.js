const data = {
  "DCC": ["Webs", "Bases de datos", "Minería de Datos", "PSS", "Logaritmos"],
  "DIM": ["Intro al calculo", "Lineal", "EDO", "CVV"],
  "DFI": ["Clásica", "Electro", "Meca", "Moderna"],
};

const poblarDepartamentos = () => {
  let departmentSelect = document.getElementById("select-department");
  for (const department in data) {
      let option = document.createElement("option");
      option.value = department;
      option.text = department;
      departmentSelect.appendChild(option);
  }
};

const updateCursos = () => {
  let departmentSelect = document.getElementById("select-department");
  let courseSelect = document.getElementById("select-course");
  let selectedDepartment = departmentSelect.value;
  
  courseSelect.innerHTML = '<option value="">Seleccione un ramo</option>';
  
  if (data[selectedDepartment]) {
      data[selectedDepartment].forEach(course => {
          let option = document.createElement("option");
          option.value = course;
          option.text = course;
          courseSelect.appendChild(option);
      });
  }
  changeArguments();
};

function changeArguments() {
  const courseSelect = document.getElementById("select-course");
  const reasonLabel = document.querySelector("label[for='reason']");
  const reasonTextarea = document.getElementById("comments");
  
  if (courseSelect.value !== "") {
      reasonLabel.style.display = "block";
      reasonTextarea.style.display = "block";
  } else {
      reasonLabel.style.display = "none";
      reasonTextarea.style.display = "none";
  }
}

document.getElementById("select-department").addEventListener("change", updateCursos);
document.getElementById("select-course").addEventListener("change", changeArguments);

window.onload = () => {
  poblarDepartamentos();
  changeArguments();
};