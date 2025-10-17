from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter
from schema import schema 
from fastapi.middleware.cors import CORSMiddleware

graphql_app = GraphQLRouter(schema)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(graphql_app, prefix="/graphql")