import neo4j from 'neo4j-driver';
import { NEO4J_PASSWORD } from '$env/static/private';

const neo = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', NEO4J_PASSWORD));

export default neo;
