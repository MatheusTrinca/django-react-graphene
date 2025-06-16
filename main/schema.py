import graphene
import graphql_jwt

from todo.schema import schema as todo_schema


class Query(todo_schema.Query, graphene.ObjectType):
    pass


class Mutation(todo_schema.Mutation, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
