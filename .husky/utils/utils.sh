print_message() {
  DIVIDER="\n\n----------------------------------------------------------------------------------\n\n"
  YELLOW="\033[0;00m"
  NC="\033[0m" # No Color
  printf "${YELLOW}${DIVIDER}$1${DIVIDER}${NC}"
}