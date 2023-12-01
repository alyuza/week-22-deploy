from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from todo.models import Task
from db import db
from sqlalchemy.orm import joinedload

todo_blueprint = Blueprint("todo", __name__)

@todo_blueprint.route("/tasks", methods=["POST"])
@jwt_required()
def create_task():
    data = request.get_json()

    # Extracting values from the JSON payload
    title = data.get("title")
    status = data.get("status")
    priority = data.get("priority")
    duedate = data.get("duedate")

    # Creating a new Task instance with the extracted values
    new_task = Task(title=title, status=status, priority=priority, duedate=duedate)

    # Adding the new task to the database and committing the changes
    db.session.add(new_task)
    db.session.commit()

    return {"message": "Task created successfully", "task_id": new_task.id}



@todo_blueprint.route("/tasks", methods=["GET"])
@jwt_required()
def get_all_tasks():
    tasks = Task.query.all()

    task_list = []
    for task in tasks:
        task_info = {
            "id": task.id,
            "title": task.title,
            "status": task.status,
            "priority": task.priority,
            "duedate": task.duedate
        }
        task_list.append(task_info)

    return task_list


@todo_blueprint.route("/tasks/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id):
    task = Task.query.get(task_id)

    if not task:
        return {"error": "Task not found!"}, 404

    data = request.get_json()
    status = data.get("status")
    priority = data.get("priority")
    duedate = data.get("duedate")

    task.status = status
    task.priority = priority
    task.duedate = duedate
    db.session.commit()

    return {"message": "Task updated successfully"}


@todo_blueprint.route("/tasks/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    task = Task.query.get(task_id)

    if not task:
        return {"error": "Task not found!"}, 404

    db.session.delete(task)
    db.session.commit()

    return {"message": "Task deleted successfully"}
