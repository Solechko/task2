var academy = require('../academy');
var academyTestData = require('../academy-test-data');
var chai = require('chai');

describe('addMentor', function() {
  	it('добавляет ментора', function() {
  		var mentors = academy.getMentors();
	  	var mentorsLength = mentors.length;
	 	var newMentorId = academy.addMentor('Ментор');		
		var newMentorsLength = mentors.length;
		var addedMentor = academy.getMentorById(newMentorId);

		var res = (mentorsLength + 1 === newMentorsLength &&
				   addedMentor.mentorName === 'Ментор');
		chai.assert.equal(res, true);
  	});

  	it ('выбрасывает exception, при неверных параметрах', function() {
  		chai.assert.throw(function() { academy.addMentor() }, Error);
  	});
});

describe('addStudent', function() {
  	it('добавляет студента', function() {
  		var students = academy.getStudents();
	  	var studentsLength = students.length;
		var newStudentId = academy.addStudent('Студент');		
		var newStudentsLength = students.length;
		var addedStudent = academy.getStudentById(newStudentId);
		
		var res = (studentsLength + 1 === newStudentsLength &&
				   addedStudent.studentName === 'Студент');
		chai.assert.equal(res, true);
  	});

  	it ('выбрасывает exception, при неверных параметрах', function() {
  		chai.assert.throw(function() { academy.addStudent() }, Error);
  	});
});

describe('addTeam', function() {
  	it('добавляет пустую команду', function() {
  		var teams = academy.getTeams();
	  	var teamsLength = teams.length;
		var newTeamId = academy.addTeam('Команда');		
		var newTeamsLength = teams.length;
		var addedTeam = academy.getTeamById(newTeamId);
		
		var res = (teamsLength + 1 === newTeamsLength &&
				   addedTeam.teamName === 'Команда' &&
				   addedTeam.teamStudentsIds.length === 0);
		chai.assert.equal(res, true);
  	});

  	it('добавляет команду c заданными студентами', function() {
  		var student1 = academy.addStudent('Студент');
  		var student2 = academy.addStudent('Студент');
  		var teams = academy.getTeams();
	  	var teamsLength = teams.length;
		var newTeamId = academy.addTeam('Команда', [student1, student2]);		
		var newTeamsLength = teams.length;
		var addedTeam = academy.getTeamById(newTeamId);
		
		var res = (teamsLength + 1 === newTeamsLength &&
				   addedTeam.teamName === 'Команда' &&
				   addedTeam.teamStudentsIds.length === 2);
		chai.assert.equal(res, true);
  	});

  	it ('выбрасывает exception, при неверных параметрах', function() {
  		chai.assert.throw(function() { academy.addTeam() }, Error);
  	});

  	it ('выбрасывает exception, при добавлении к команде несуществующих студентов', function() {
  		chai.assert.throw(function() { academy.addTeam('Команда', [999999]) }, Error);
  	});
});

describe('addStudentToTeam', function() {
  	it('добавляет cтудента к существующей команде', function() {
  		var teamId = academy.addTeam('Команда');
  		var team = academy.getTeamById(teamId);
  		var studentId = academy.addStudent('Студент');
  		var teamMembersCount = team.teamStudentsIds.length;
  		academy.addStudentToTeam(teamId, studentId);
  		var newTeamMembersCount = team.teamStudentsIds.length;

  		var res = (teamMembersCount + 1 === newTeamMembersCount &&
  				   team.teamStudentsIds.length === 1 &&
  				   team.teamStudentsIds.indexOf(studentId) >= 0);
  		chai.assert.equal(res, true);
  	});

  	it ('выбрасывает exception, при неверных параметрах', function() {
  		chai.assert.throw(function() { academy.addStudentToTeam() }, Error);
  	});

  	it ('выбрасывает exception, при добавлении к команде несуществующих студентов', function() {
		var teamId = academy.addTeam('Команда');
  		chai.assert.throw(function() { academy.addStudentToTeam(teamId, 999999) }, Error);
  	});

  	it ('выбрасывает exception, при добавлении студентов к несуществующей команде', function() {
		var studentId = academy.addStudent('Студент');
  		chai.assert.throw(function() { academy.addStudentToTeam(999999, studentId) }, Error);
  	});
});

describe('addTask', function() {
  	it('добавляет задание', function() {
  		var tasks = academy.getTasks();
	  	var tasksLength = tasks.length;
		var newTaskId = academy.addTask('Описание задания');		
		var newTasksLength = tasks.length;
		var addedTask = academy.getTaskById(newTaskId);
		
		var res = (tasksLength + 1 === newTasksLength &&
				   addedTask.taskDescription === 'Описание задания');
		chai.assert.equal(res, true);
  	});

  	it ('выбрасывает exception, при неверных параметрах', function() {
  		chai.assert.throw(function() { academy.addTask() }, Error);
  	});
});

describe('assignTaskToStudent', function() {
  	it('назначает задание студенту', function() {
  		var studentId = academy.addStudent('Студент');
  		var taskId = academy.addTask('Задание');
  		var studentsAssignmentsLength = academy.getStudentsAssignments().length;
  		academy.assignTaskToStudent(taskId, studentId);
  		var studentsAssignments = academy.getStudentsAssignments();
  		var newStudentsAssignmentsLength = studentsAssignments.length;

  		var filteredStudentsAssignments = studentsAssignments.filter(function (assignment){
  			return assignment.taskId === taskId && assignment.executorId === studentId;
  		})
  		
  		var res = (studentsAssignmentsLength + 1 === newStudentsAssignmentsLength &&
  				   filteredStudentsAssignments.length === 1 &&
  				   filteredStudentsAssignments[0].taskId === taskId &&
  				   filteredStudentsAssignments[0].executorId === studentId);
  		chai.assert.equal(res, true);
  	});

  	it ('выбрасывает exception, при неверных параметрах', function() {
  		chai.assert.throw(function() { academy.assignTaskToStudent() }, Error);
  	});

  	it ('выбрасывает exception, при назначении задания несуществующему студенту', function() {
  		var taskId = academy.addTask('Задание');
  		chai.assert.throw(function() { academy.assignTaskToStudent(taskId, 999999) }, Error);
  	});

  	it ('выбрасывает exception, при назначении студенту несуществующего задания', function() {
  		var studentId = academy.addStudent('Студент');
  		chai.assert.throw(function() { academy.assignTaskToStudent(999999, studentId) }, Error);
  	});

  	it ('выбрасывает exception, если задание уже назначено студенту', function() {
  		var studentId = academy.addStudent('Студент');
  		var taskId = academy.addTask('Задание');
  		academy.assignTaskToStudent(taskId, studentId);
  		chai.assert.throw(function() { academy.assignTaskToStudent(taskId, studentId) }, Error);
  	});
});

describe('assignTaskToTeam', function() {
  	it('назначает задание команде', function() {
  		var teamId = academy.addTeam('Команда');
  		var taskId = academy.addTask('Задание');
  		var teamsAssignmentsLength = academy.getTeamsAssignments().length;
  		academy.assignTaskToTeam(taskId, teamId);
  		var teamsAssignments = academy.getTeamsAssignments();
  		var newTeamsAssignmentsLength = teamsAssignments.length;

  		var filteredTeamsAssignments = teamsAssignments.filter(function (assignment){
  			return assignment.taskId === taskId && assignment.executorId === teamId;
  		})

  		var res = (teamsAssignmentsLength + 1 === newTeamsAssignmentsLength &&
  				   filteredTeamsAssignments.length === 1 &&
  				   filteredTeamsAssignments[0].taskId === taskId &&
  				   filteredTeamsAssignments[0].executorId === teamId);
  		chai.assert.equal(res, true);
  	});

  	it ('выбрасывает exception, при неверных параметрах', function() {
  		chai.assert.throw(function() { academy.assignTaskToTeam() }, Error);
  	});

  	it ('выбрасывает exception, при назначении задания несуществующей команде', function() {
  		var taskId = academy.addTask('Задание');
  		chai.assert.throw(function() { academy.assignTaskToStudent(taskId, 999999) }, Error);
  	});

  	it ('выбрасывает exception, при назначении команде несуществующего задания', function() {
  		var teamId = academy.addTeam('Команда');
  		chai.assert.throw(function() { academy.assignTaskToTeam(999999, teamId) }, Error);
  	});

  	it ('выбрасывает exception, если задание уже назначено команде', function() {
  		var teamId = academy.addTeam('Команда');
  		var taskId = academy.addTask('Задание');
  		academy.assignTaskToStudent(taskId, teamId);
  		chai.assert.throw(function() { academy.assignTaskToStudent(taskId, teamId) }, Error);
  	});
});

describe('evaluateStudentAssignment', function() {
  	it('выставляет оценку студенту за задание', function() {
  		var studentId = academy.addStudent('Студент');
  		var taskId = academy.addTask('Задание');
  		academy.assignTaskToStudent(taskId, studentId);
  		academy.evaluateStudentAssignment(taskId, studentId, 5);
  		var studentsAssignments = academy.getStudentsAssignments();

  		var filteredStudentsAssignments = studentsAssignments.filter(function (assignment){
  			return assignment.taskId === taskId && assignment.executorId === studentId;
  		})
  	
  		var res = (filteredStudentsAssignments.length === 1 &&
  				   filteredStudentsAssignments[0].taskId === taskId &&
  				   filteredStudentsAssignments[0].executorId === studentId &&
  				   filteredStudentsAssignments[0].evaluation === 5);
  		chai.assert.equal(res, true);
  	});

  	it ('выбрасывает exception, при неверных параметрах', function() {
  		chai.assert.throw(function() { academy.evaluateStudentAssignment() }, Error);
  	});

  	it ('выбрасывает exception, при выставлении оценки несуществующему студенту', function() {
  		var taskId = academy.addTask('Задание');
  		chai.assert.throw(function() { academy.evaluateStudentAssignment(taskId, 999999, 5) }, Error);
  	});

  	it ('выбрасывает exception, при выставлении оценки за несуществующее задание', function() {
  		var studentId = academy.addStudent('Студент');
  		chai.assert.throw(function() { academy.evaluateStudentAssignment(999999, studentId, 5) }, Error);
  	});

  	it ('выбрасывает exception, если задание не было назначено студенту', function() {
  		var studentId = academy.addStudent('Студент');
  		var taskId = academy.addTask('Задание');  		
  		chai.assert.throw(function() { academy.evaluateStudentAssignment(taskId, studentId, 5) }, Error);
  	});
});

describe('evaluateTeamAssignment', function() {
  	it('выставляет оценку команде за задание', function() {
  		var teamId = academy.addTeam('Команда');
  		var taskId = academy.addTask('Задание');
  		academy.assignTaskToTeam(taskId, teamId);
  		academy.evaluateTeamAssignment(taskId, teamId, 5);
  		var teamsAssignments = academy.getTeamsAssignments();

  		var filteredTeamsAssignments = teamsAssignments.filter(function (assignment){
  			return assignment.taskId === taskId && assignment.executorId === teamId;
  		})
  	
  		var res = (filteredTeamsAssignments.length === 1 &&
  				   filteredTeamsAssignments[0].taskId === taskId &&
  				   filteredTeamsAssignments[0].executorId === teamId &&
  				   filteredTeamsAssignments[0].evaluation === 5);
  		chai.assert.equal(res, true);
  	});

  	it ('выбрасывает exception, при неверных параметрах', function() {
  		chai.assert.throw(function() { academy.evaluateTeamAssignment() }, Error);
  	});

  	it ('выбрасывает exception, при выставлении оценки несуществующей команде', function() {
  		var taskId = academy.addTask('Задание');
  		chai.assert.throw(function() { academy.evaluateTeamAssignment(taskId, 999999, 5) }, Error);
  	});

  	it ('выбрасывает exception, при выставлении оценки за несуществующее задание', function() {
  		var teamId = academy.addTeam('Команда');
  		chai.assert.throw(function() { academy.evaluateTeamAssignment(999999, teamId, 5) }, Error);
  	});

  	it ('выбрасывает exception, если задание не было назначено команде', function() {
  		var teamId = academy.addTeam('Команда');
  		var taskId = academy.addTask('Задание');  		
  		chai.assert.throw(function() { academy.evaluateStudentAssignment(taskId, teamId, 5) }, Error);
  	});
});

describe('setStudentPriority', function() {
  	it('выставляет приоритезированный список менторов у студента ', function() {
  		academy.resetData();
  		var studentId = academy.addStudent('Студент');
  		var mentor1 = academy.addMentor('Ментор');
  		var mentor2 = academy.addMentor('Ментор');
  		var mentor3 = academy.addMentor('Ментор');
  		var priorities = [mentor2, mentor3, mentor1];
  		academy.setStudentPriority(studentId, priorities);
  		var studentsPriorities = academy.getStudentPriorities();
  		filteredStudentsPriorities = studentsPriorities.filter(function (priority){
  			return priority.studentId === studentId && priority.mentorsIds === priorities;
  		});

  		var res = filteredStudentsPriorities.length === 1;
  		chai.assert.equal(res, true);
  	});

  	it ('выбрасывает exception, при неверных параметрах', function() {
  		chai.assert.throw(function() { academy.setStudentPriority() }, Error);
  	});

  	it ('выбрасывает exception, при выставлении приоритетов несуществующим студентом', function() {
  		academy.resetData();
  		var mentor1 = academy.addMentor('Ментор');
  		var mentor2 = academy.addMentor('Ментор');
  		var mentor3 = academy.addMentor('Ментор');
  		var priorities = [mentor2, mentor3, mentor1];
  		chai.assert.throw(function() { academy.setStudentPriority(999999, priorities); }, Error);
  	});

  	it ('выбрасывает exception, при неправильном количестве приоритетов для менторов у студента', function() {
  		academy.resetData();
  		var studentId = academy.addStudent('Студент');
  		var mentor1 = academy.addMentor('Ментор');
  		var mentor2 = academy.addMentor('Ментор');
  		var mentor3 = academy.addMentor('Ментор');
  		var priorities = [mentor2, mentor3];
  		chai.assert.throw(function() { academy.setStudentPriority(studentId, priorities); }, Error);
  	});

  	it ('выбрасывает exception, если хоть один из идентификаторов менторов в приоритетах не существует', function() {
  		academy.resetData();
  		var studentId = academy.addStudent('Студент');
  		var mentor1 = academy.addMentor('Ментор');
  		var mentor2 = academy.addMentor('Ментор');
  		var mentor3 = academy.addMentor('Ментор');
  		var priorities = [mentor2, mentor3, 999999]; 		
  		chai.assert.throw(function() { academy.setStudentPriority(studentId, priorities); }, Error);
  	});
});

describe('setMentorPriority', function() {
  	it('выставляет приоритезированный список студентов у ментора', function() {
  		academy.resetData();
  		var mentorId = academy.addMentor('Ментор');
  		var student1 = academy.addStudent('Студент');
  		var student2 = academy.addStudent('Студент');
  		var student3 = academy.addStudent('Студент');
  		var priorities = [student2, student3, student1];
  		academy.setMentorPriority(mentorId, priorities);
  		var mentorPriorities = academy.getMentorPriorities();
  		filteredMentorPriorities = mentorPriorities.filter(function (priority){
  			return priority.mentorId === mentorId && priority.studentsIds === priorities;
  		});

  		var res = filteredMentorPriorities.length === 1;
  		chai.assert.equal(res, true);
  	});

  	it ('выбрасывает exception, при неверных параметрах', function() {
  		chai.assert.throw(function() { academy.setMentorPriority() }, Error);
  	});

  	it ('выбрасывает exception, при выставлении приоритетов несуществующим ментором', function() {
  		academy.resetData();
  		var student1 = academy.addStudent('Студент');
  		var student2 = academy.addStudent('Студент');
  		var student3 = academy.addStudent('Студент');
  		var priorities = [student2, student3, student1];
  		chai.assert.throw(function() { academy.setMentorPriority(999999, priorities); }, Error);
  	});

  	it ('выбрасывает exception, при неправильном количестве приоритетов для студентов у ментора', function() {
  		academy.resetData();
  		var mentorId = academy.addMentor('Ментор');
  		var student1 = academy.addStudent('Студент');
  		var student2 = academy.addStudent('Студент');
  		var student3 = academy.addStudent('Студент');
  		var priorities = [student2, student3];
  		chai.assert.throw(function() { academy.setMentorPriority(mentorId, priorities); }, Error);
  	});

  	it ('выбрасывает exception, если хоть один из идентификаторов студентов в приоритетах не существует', function() {  		
  		academy.resetData();
  		var mentorId = academy.addMentor('Ментор');
  		var student1 = academy.addStudent('Студент');
  		var student2 = academy.addStudent('Студент');
  		var student3 = academy.addStudent('Студент');
  		var priorities = [student2, student3, 999999];		
  		chai.assert.throw(function() { academy.setMentorPriority(mentorId, priorities) }, Error);
  	});
});

describe('formMentorGroups', function() {
    it('распределяет студентов по группам менторов', function() {
      academy.resetData();
      var student1 = academy.addStudent('Студент');
      var student2 = academy.addStudent('Студент');
      var student3 = academy.addStudent('Студент');
      var student4 = academy.addStudent('Студент');
      var mentor1 = academy.addMentor('Ментор');
      var mentor2 = academy.addMentor('Ментор');

      academy.setMentorPriority(mentor1, [student1, student2, student3, student4] );
      academy.setMentorPriority(mentor2, [student4, student3, student2, student1] );
      academy.setStudentPriority(student1, [mentor1, mentor2]);
      academy.setStudentPriority(student2, [mentor1, mentor2]);
      academy.setStudentPriority(student3, [mentor2, mentor1]);
      academy.setStudentPriority(student4, [mentor2, mentor1]);

      var mentorGroups = academy.formMentorGroups();
      var firstMentorGroup = mentorGroups.filter(function(mentorGroup){
          return mentorGroup.mentorId == mentor1;
      });

      var secondMentorGroup = mentorGroups.filter(function(mentorGroup){
          return mentorGroup.mentorId == mentor2;
      });

      var filteredFirstGroupMembers = firstMentorGroup[0].members.filter (function(member){
          return member === student1;
      });
      

      var filteredSecondGroupMembers = secondMentorGroup[0].members.filter (function(member){
          return member === student4;
      });
    
      var res = mentorGroups.length === 2 &&
                mentorGroups[0].members.length === 2 &&
                mentorGroups[1].members.length === 2 &&
                filteredFirstGroupMembers.length === 1 &&
                filteredSecondGroupMembers.length === 1;
      chai.assert.equal(res, true);

    });    

    it ('выбрасывает exception, если не все менторы указали приоритезированные списки студентов', function() {
      academy.resetData();
      var student1 = academy.addStudent('Студент');
      var student2 = academy.addStudent('Студент');
      var student3 = academy.addStudent('Студент');
      var student4 = academy.addStudent('Студент');
      var mentor1 = academy.addMentor('Ментор');
      var mentor2 = academy.addMentor('Ментор');

      academy.setMentorPriority(mentor1, [student3, student1, student2, student4] );
      //academy.setMentorPriority(mentor2, [student4, student1, student2, student3] );
      academy.setStudentPriority(student1, [mentor1, mentor2]);
      academy.setStudentPriority(student2, [mentor1, mentor2]);
      academy.setStudentPriority(student3, [mentor2, mentor1]);
      academy.setStudentPriority(student4, [mentor1, mentor2]);
      
      chai.assert.throw(function() { academy.formMentorGroups(); }, Error);
    });

    it ('выбрасывает exception, не все студенты указали приоритезированные списки менторов', function() {
      academy.resetData();
      var student1 = academy.addStudent('Студент');
      var student2 = academy.addStudent('Студент');
      var student3 = academy.addStudent('Студент');
      var student4 = academy.addStudent('Студент');
      var mentor1 = academy.addMentor('Ментор');
      var mentor2 = academy.addMentor('Ментор');

      academy.setMentorPriority(mentor1, [student3, student1, student2, student4] );
      academy.setMentorPriority(mentor2, [student4, student1, student2, student3] );
      //academy.setStudentPriority(student1, [mentor1, mentor2]);
      //academy.setStudentPriority(student2, [mentor1, mentor2]);
      academy.setStudentPriority(student3, [mentor2, mentor1]);
      academy.setStudentPriority(student4, [mentor1, mentor2]);
      
      chai.assert.throw(function() { academy.formMentorGroups(); }, Error);
    });

    it ('выбрасывает exception, если ментор указал приоритет не для всех студентов', function() {      
      academy.resetData();
      var student1 = academy.addStudent('Студент');
      var student2 = academy.addStudent('Студент');
      var student3 = academy.addStudent('Студент');
      var student4 = academy.addStudent('Студент');
      var mentor1 = academy.addMentor('Ментор');
      var mentor2 = academy.addMentor('Ментор');

      academy.setMentorPriority(mentor1, [student3, student1, student2, student4] );
      academy.setMentorPriority(mentor2, [student4, student1, student2, student3] );
      academy.setStudentPriority(student1, [mentor1, mentor2]);
      academy.setStudentPriority(student2, [mentor1, mentor2]);
      academy.setStudentPriority(student3, [mentor2, mentor1]);
      academy.setStudentPriority(student4, [mentor1, mentor2]);
      
      var student5 = academy.addStudent('Студент');
      var student6 = academy.addStudent('Студент');
      
      chai.assert.throw(function() { academy.formMentorGroups(); }, Error);
    });

    it ('выбрасывает exception, если студент указал приоритет не для всех менторов', function() {      
      academy.resetData();
      var student1 = academy.addStudent('Студент');
      var student2 = academy.addStudent('Студент');
      var student3 = academy.addStudent('Студент');
      var student4 = academy.addStudent('Студент');
      var mentor1 = academy.addMentor('Ментор');
      var mentor2 = academy.addMentor('Ментор');

      academy.setMentorPriority(mentor1, [student3, student1, student2, student4] );
      academy.setMentorPriority(mentor2, [student4, student1, student2, student3] );
      academy.setStudentPriority(student1, [mentor1, mentor2]);
      academy.setStudentPriority(student2, [mentor1, mentor2]);
      academy.setStudentPriority(student3, [mentor2, mentor1]);
      academy.setStudentPriority(student4, [mentor1, mentor2]);

      var mentor3 = academy.addMentor('Ментор');
      var mentor4 = academy.addMentor('Ментор');
      
      chai.assert.throw(function() { academy.formMentorGroups(); }, Error);
    });
});

describe('exportJson, importJson', function() {
    it('экспортирует объекты в JSON и импортирует их обратно', function() {
      academyTestData.add();
      var mentors = academy.getMentors();
      var students = academy.getStudents();
      var teams = academy.getTeams();
      var tasks = academy.getTasks();
      var studentsAssignments = academy.getStudentsAssignments();
      var teamsAssignments = academy.getTeamsAssignments();
      var studentPriorities = academy.getStudentPriorities();
      var mentorPriorities = academy.getMentorPriorities();

      var json = academy.exportJson();
      academy.importJson(json);

      var mentorsNew = academy.getMentors();
      var studentsNew = academy.getStudents();
      var teamsNew = academy.getTeams();
      var tasksNew = academy.getTasks();
      var studentsAssignmentsNew = academy.getStudentsAssignments();
      var teamsAssignmentsNew = academy.getTeamsAssignments();
      var studentPrioritiesNew = academy.getStudentPriorities();
      var mentorPrioritiesNew = academy.getMentorPriorities();      
      
      var res = (
        mentors.length === mentorsNew.length && mentors.length === 4 &&
        students.length === studentsNew.length && students.length === 6 &&
        teams.length === teamsNew.length && teams.length === 2 &&
        tasks.length === tasksNew.length && tasks.length === 4 &&
        studentsAssignments.length === studentsAssignmentsNew.length && studentsAssignments.length === 4 &&
        teamsAssignments.length === teamsAssignmentsNew.length && teamsAssignments.length === 4 &&
        studentPriorities.length === studentPrioritiesNew.length && studentPriorities.length === 6 &&
        mentorPriorities.length === mentorPrioritiesNew.length && mentorPriorities.length === 4 );
      chai.assert.equal(res, true);

    });
});

