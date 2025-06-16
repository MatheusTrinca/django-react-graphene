import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from .models import Todo


class TodoType(DjangoObjectType):
    class Meta:
        model = Todo
        fields = ("id", "title", "date")


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class Query(graphene.ObjectType):
    todos = graphene.List(TodoType, id=graphene.Int())

    @login_required
    def resolve_todos(self, info, **kwargs):
        if kwargs.get("id"):
            return Todo.objects.filter(id=kwargs.get("id"))

        return Todo.objects.all().order_by("-id")


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, username, password):
        user = get_user_model()(username=username)
        user.set_password(password)
        user.save()
        return CreateUser(user=user)


class CreateTodo(graphene.Mutation):
    todo = graphene.Field(TodoType)

    class Arguments:
        title = graphene.String(required=True)

    @login_required
    def mutate(self, info, title):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Login required")
        todo = Todo(title=title)
        todo.save()
        return CreateTodo(todo=todo)


class UpdateTodo(graphene.Mutation):
    todo = graphene.Field(TodoType)

    class Arguments:
        id = graphene.Int(required=True)
        title = graphene.String(required=True)

    @login_required
    def mutate(self, info, id, title):
        todo = Todo.objects.get(id=id)
        todo.title = title
        todo.save()
        return UpdateTodo(todo=todo)


class DeleteTodo(graphene.Mutation):
    message = graphene.String()

    class Arguments:
        id = graphene.Int(required=True)

    @login_required
    def mutate(self, info, id):
        todo = Todo.objects.get(id=id)
        todo.delete()
        return DeleteTodo(message=f"Todo id: {id} was deleted")


class Mutation(graphene.ObjectType):
    create_todo = CreateTodo.Field()
    update_todo = UpdateTodo.Field()
    delete_todo = DeleteTodo.Field()
    create_user = CreateUser.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
