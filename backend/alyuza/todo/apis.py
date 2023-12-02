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

    current_user_id = get_jwt_identity()

    # Extracting values from the JSON payload
    title = data.get("title")
    status = data.get("status")
    priority = data.get("priority")
    duedate = data.get("duedate")

    # Creating a new Task instance with the extracted values
    new_task = Task(title=title, status=status, priority=priority, duedate=duedate, user_id=current_user_id)

    # Adding the new task to the database and committing the changes
    db.session.add(new_task)
    db.session.commit()

    return {"message": "Task created successfully", "task_id": new_task.id}


from flask_jwt_extended import get_jwt_identity

@todo_blueprint.route("/tasks", methods=["GET"])
@jwt_required()
def get_user_tasks():
    # Get the user_id from the JWT token
    current_user_id = get_jwt_identity()

    # Query tasks associated with the current user
    tasks = Task.query.filter_by(user_id=current_user_id).all()

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

    if status is not None:
        task.status = status
    if priority is not None:
        task.priority = priority
    if duedate is not None:
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
