#!/bin/bash

#load profile to get access to rvm
source /etc/profile

#if rvm installed use ruby 2, just in case it was not yet loaded
if
	which rvm
then
	rvm use 2
fi

# run the migration
rake migrate:all