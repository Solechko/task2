var academy = require('./academy');
var academyTestData = require('./academy-test-data');
var prompt = require('prompt');
var fs = require('fs');

console.log('========================================');
console.log('      Менеджер академии студентов       ');
console.log('========================================');
prompt.start();
promptCommand();

// Запросить и считать команду из командной строки
function promptCommand()
{
	console.log('Введите команду (help - справка, \'exit\' или CTRL+C для выхода)...');
	prompt.get(['command'], function (err, result) {		
		if (result !== undefined) {			
			if (result.command !== 'exit') {
				try
				{
				 	executeCommand(result.command);
				}
				catch(err) {
					console.log('Ошибка выполнения команды:');
					console.log(err);
				}
				console.log();
				promptCommand();
			}
		}
	});
}

// Выполнить команду
function executeCommand(command) {
	var args = splitArgs(command);
	console.log();

	if (args === null)
		throw new Error('Некорректно заданы аргументы');

	switch (args[0]) {
		case 'ls':
		case 'list':
			commandList(args);
			break;
		case 'add':
			commandAdd(args);
			break;
		case 'assign':
		case 'assigntask':
			commandAssignTask(args);
			break;
		case 'eval':
		case 'evaluate':
			commandEvaluate(args);
			break;			
		case 'prior':
			commandPriority(args);
			break;
		case 'formgroups':
			commandFormGroups();
			break;	
		case 'import':
			commandImport(args);
			break;			
		case 'export':
			commandExport(args);
			break;		
		case 'filltest':
			academyTestData.add();
			console.log('Добавлены тестовые данные');			
			break;	
		case 'help':
			showHelp();
			break;
		default:
			console.log('Команда не найдена');
			break;
	}
}

// Выполнение команды отображения списка объектов
function commandList(args) {
	switch (args[1]) {
		case 'ment':
		case 'mentor':
			listMentors();
			break;
		case 'stud':
		case 'student':
			listStudents();
			break;
		case 'task':
			listTasks();
			break;
		case 'team':
			listTeams();
			break;
		case 'taskstud':
			listStudentAssignments();
			break;
		case 'taskteam':
			listTeamAssignments();
			break;
		case 'priorstud':
		case 'priorstudent':
			listStudentPriorities();
			break;
		case 'priorment':
		case 'priormentor':
			listMentorPriorities();
			break;			
		default:
			console.log('Неподдерживаемая команда для вывода списка');
			break;
	}	
}

// Выполнение команды добавления объектов
function commandAdd(args) {
	var id;
	var name = args[2];
	switch (args[1]) {
		case 'ment':
		case 'mentors':
			id = academy.addMentor(name);
			console.log('Добавлен ментор с идентификатором %s: %s', id, name);
			break;
		case 'stud':
		case 'student':
			id = academy.addStudent(name);
			console.log('Добавлен студент с идентификатором %s: %s', id, name);
			break;		
		case 'team':
			id = academy.addTeam(name);
			console.log('Добавлена команда с идентификатором %s: %s', id, name);
			break;
		case 'task':
			id = academy.addTask(name);
			console.log('Добавлена задача с идентификатором %s: %s', id, name);
			break;
		default:
			console.log('Неподдерживаемая команда для добавления');
			break;					
	}	
}

// Выполнение команды назначения задач
function commandAssignTask(args) {
	if (args.length < 4)
		throw new Error('Недостаточное число аргументов');

	var taskId = parseInt(args[2]);
	var executorId = parseInt(args[3]);
	switch (args[1]) {
		case 'stud':
		case 'student':
			academy.assignTaskToStudent(taskId, executorId);
			console.log('Для студента id=%s добавлена задача id=%s', executorId, taskId);
			break;		
		case 'team':
			academy.assignTaskToTeam(taskId, executorId);
			console.log('Для команды id=%s добавлена задача id=%s', executorId, taskId);
			break;
		default:
			console.log('Неподдерживаемая команда для назначения задачи');
			break;			
	}
}

// Выполнение команды выставления оценки
function commandEvaluate(args) {
	if (args.length < 5)
		throw new Error('Недостаточное число аргументов');

	var taskId = parseInt(args[2]);
	var executorId = parseInt(args[3]);
	var evaluation = args[4];
	switch (args[1]) {
		case 'stud':
		case 'student':
			academy.evaluateStudentAssignment(taskId, executorId, evaluation);
			console.log('Выставлена оценка студенту id=%s за задачу id=%s: %s', executorId, taskId, evaluation);
			break;		
		case 'team':
			academy.evaluateTeamAssignment(taskId, executorId, evaluation);
			console.log('Выставлена оценка команде id=%s за задачу id=%s: %s', executorId, taskId, evaluation);
			break;
		default:
			console.log('Неподдерживаемый аргумент для выставления оценки');
			break;	
	}
}

// Выполнение команды создания приоретизрованных списков
function commandPriority(args) {
	if (args.length < 4)
		throw new Error('Недостаточное число аргументов');

	console.log(args);
	var id = parseInt(args[2]);
	var priorityString = args[3];
	console.log(priorityString);
	var prioritiesStrings = splitByComma(priorityString);
	var priorities = [];
	prioritiesStrings.forEach(function(priorityStr){
		priorities.push(parseInt(priorityStr));
	});
	console.log(priorities);

	switch (args[1]) {
		case 'ment':
		case 'mentor':
			academy.setMentorPriority(id, priorities);
			console.log('Добавлен приоретизрованный список студентов для ментора id=%s', id);
			break;		
		case 'stud':
		case 'student':
			academy.setStudentPriority(id, priorities);
			console.log('Добавлен приоретизрованный список менторов для студента id=%s', id);
			break;
		default:
			console.log('Неподдерживаемая команда для создания приоретизированного списка');
			break;			
	}	
}

// Выполнение команды импорта
function commandImport(args) {
	if (args.length < 3)
		throw new Error('Недостаточное число аргументов');

	var filePath = args[2];
	switch (args[1]) {
		case 'json':
			var jsonFileData = readLocalFile(filePath + '.json');
			academy.importJson(jsonFileData);
			console.log('Импорт из JSON выполнен!');
			break;
		default:
			console.log('Неподдерживаемый формат импорта');
			break;	
	}
}

// Выполнение команды экспорта
function commandExport(args) {
	if (args.length < 3)
		throw new Error('Недостаточное число аргументов');

	var filePath = args[2];
	switch (args[1]) {
		case 'json':
			var json = academy.exportJson();
			writeLocalFile(filePath + '.json', json);
			console.log('Экспорт в JSON выполнен!');
			break;
		default:
			console.log('Неподдерживаемый формат экспорта');
			break;	
	}
}

// Выполнение команды распределения студентов среди менторов в соответствии с приоритизированными списками
function commandFormGroups() {
	var mentorGroups = academy.formMentorGroups();

	console.log('Распределение студентов среди менторов в соответствии с приоритизированными списками:');
	console.log('Ментор\t\t| Id студента \t| Студент');
	console.log('-------------------------------------------------------------------------');
	mentorGroups.forEach(function(mentorGroup) {
		var mentor = academy.getMentorById(mentorGroup.mentorId);
		console.log('Id:%s "%s"', mentorGroup.mentorId, mentor.mentorName);
		mentorGroup.members.forEach(function(studentId){
			var student = academy.getStudentById(studentId);
			console.log('\t\t| %s\t\t| %s', student.studentId, student.studentName);
		});
		console.log('-------------------------------------------------------------------------');
	});
}

// Вывести список менторов
function listMentors() {
	console.log('Список менторов:');
	console.log('Id\t| Имя');
	console.log('-------------------------------------------------------------------------');
	var mentors = academy.getMentors();
	mentors.forEach(function(mentor){
		console.log('%s\t| %s', mentor.mentorId, mentor.mentorName);
	});
}

// Вывести список студентов
function listStudents() {
	console.log('Список студентов:');
	console.log('Id\t| Имя');
	console.log('-------------------------------------------------------------------------');
	var students = academy.getStudents();
	students.forEach(function(student){
		console.log('%s\t| %s', student.studentId, student.studentName);
	});
}

// Вывести список задач
function listTasks() {
	console.log('Список задач:');
	console.log('Id\t| Описание задачи');
	console.log('-------------------------------------------------------------------------');
	var tasks = academy.getTasks();
	tasks.forEach(function(task){
		console.log('%s\t| %s', task.taskId, task.taskDescription);
	});
}

// Вывести список команд и студентов в них
function listTeams() {
	var teams = academy.getTeams();

	console.log('Список команд и студентов в них:');
	console.log('Команда\t\t| Id студента \t| Студент');
	console.log('-------------------------------------------------------------------------');	
	teams.forEach(function(team){
		console.log('Id:%s "%s"', team.teamId, team.teamName);
		team.teamStudentsIds.forEach(function(studentId){
			var student = academy.getStudentById(studentId);
			console.log('\t\t| %s\t\t| %s', student.studentId, student.studentName);
		});
		console.log('-------------------------------------------------------------------------');
	});
}

// Вывести список назначенных задач студентам
function listStudentAssignments() {
	console.log('Список задач у студентов:');
	console.log('Студент\t\t|Id здч\t|Оценка\t| Описание задачи');
	console.log('-------------------------------------------------------------------------');
	var students = academy.getStudents();
	var studentAssignments = academy.getStudentsAssignments();
	
	students.forEach(function(student){
		console.log('Id:%s "%s"', student.studentId, student.studentName);
		studentAssignments.forEach(function(assignment) {
    		if (assignment.executorId === student.studentId) {
    			var task = academy.getTaskById(assignment.taskId);
    			console.log('\t\t| %s\t| %s\t| %s', 
    				assignment.taskId, assignment.evaluation, task.taskDescription);
    		}
		});
		console.log('-------------------------------------------------------------------------');
	});	
}

// Вывести список назначенных задач командам
function listTeamAssignments() {
	console.log('Список задач у команд:');
	console.log('Команда\t\t|Id здч\t|Оценка\t| Описание задачи');
	console.log('-------------------------------------------------------------------------');
	var teams = academy.getTeams();
	var teamAssignments = academy.getTeamsAssignments();
	
	teams.forEach(function(team){
		console.log('Id:%s "%s"', team.teamId, team.teamName);
		teamAssignments.forEach(function(assignment) {
    		if (assignment.executorId === team.teamId) {
    			var task = academy.getTaskById(assignment.taskId);
    			console.log('\t\t| %s\t| %s\t| %s', 
    				assignment.taskId, assignment.evaluation, task.taskDescription);
    		}
		});
		console.log('-------------------------------------------------------------------------');
	});	
}

// Вывести приоретизированный список менторов у студентов
function listStudentPriorities() {	
	console.log('Приоретизированный список менторов у студентов:');
	console.log('Студент\t\t|Приоритет\t| Id ментора\t| Ментор');
	console.log('-------------------------------------------------------------------------');
	var studentPriorities = academy.getStudentPriorities();
	var students = academy.getStudents();
	
	students.forEach(function(student){
		console.log('Id:%s "%s"', student.studentId, student.studentName);
		studentPriorities.forEach(function(studPrior) {
    		if (studPrior.studentId === student.studentId) {
    			for (var i = 0; i < studPrior.mentorsIds.length; i++) {
					var mentorId = studPrior.mentorsIds[i];
					var mentor = academy.getMentorById(mentorId);
					console.log('\t\t| %s\t\t| %s\t\t| %s', i+1, mentorId, mentor.mentorName);
				}    			
    		}
		});
		console.log('-------------------------------------------------------------------------');
	});
}

// Вывести приоретизированный список студентов у менторов
function listMentorPriorities() {
	console.log('Приоретизированный список студентов у менторов:');
	console.log('Ментор\t\t|Приоритет\t| Id студента\t| Студент');
	console.log('-------------------------------------------------------------------------');
	var mentorPriorities = academy.getMentorPriorities();	
	var mentors = academy.getMentors();
	
	mentors.forEach(function(mentor){
		console.log('Id:%s "%s"', mentor.mentorId, mentor.mentorName);
		mentorPriorities.forEach(function(mentorPrior) {
    		if (mentorPrior.mentorId === mentor.mentorId) {
    			for (var i = 0; i < mentorPrior.studentsIds.length; i++) {
					var studentId = mentorPrior.studentsIds[i];
					var student = academy.getStudentById(studentId);
					console.log('\t\t| %s\t\t| %s\t\t| %s', i+1, studentId, student.studentName);
				}    			
    		}
		});
		console.log('-------------------------------------------------------------------------');
	});
}

// Разбить строку команды на аргументы
function splitArgs(commandString) {	
	var args = commandString.match(/\w+|"[^"]+"/g);
	var i = 0; 
	if (args !== null)
		i = args.length;
	while (i--) {
	    args[i] = args[i].replace(/"/g,"");
	}
	return args;
}

// Разбить строку на элементы по запятой
function splitByComma(stringWithCommas) {	
	var splitExpression = /\s*,\s*/;
	var args = stringWithCommas.split(splitExpression);
	return args;
}

// Прочитать локальный файл
function readLocalFile(filePath) {
	try
	{
		var fileData = fs.readFileSync(filePath, 'utf8');
		console.log("Файл %s успешно прочитан!", filePath);
		return fileData;
	}
	catch(err)
	{
		console.log('Ошибка чтения файла %s', filePath);
    	throw err;
	}	
}

// Записать локальный файл
function writeLocalFile(filePath, fileData) {
	try
	{
		fs.writeFileSync(filePath, fileData);
		console.log("Файл %s успешно сохранен!", filePath);
	}
	catch(err)
	{
		console.log('Ошибка сохранения файла %s', filePath);
    	throw err;
	}
}

function showHelp() {
	var helpContent = readLocalFile('Help.txt');
	console.log(helpContent);
}
